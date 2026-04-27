import { useState } from "react";
import jsQR from "jsqr";
import { traceabilityApi } from "../../services/api";

function extractBatchCode(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.batchCode) {
      return parsed.batchCode;
    }
  } catch (error) {
    // Keep plain-text handling below when QR payload is not JSON.
  }

  return trimmed;
}

async function decodeQrWithJsQr(file) {
  const image = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth"
  });

  if (!decoded?.data) {
    throw new Error("No QR code was detected in the uploaded image");
  }

  return decoded.data;
}

async function decodeQrImage(file) {
  if ("BarcodeDetector" in window) {
    const detector = new window.BarcodeDetector({
      formats: ["qr_code"]
    });
    const image = await createImageBitmap(file);
    const detectedCodes = await detector.detect(image);

    if (detectedCodes.length) {
      return detectedCodes[0].rawValue || "";
    }
  }

  return decodeQrWithJsQr(file);
}

function ScanQR() {
  const [batchCode, setBatchCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanStatus, setScanStatus] = useState("");

  async function verifyValue(value) {
    try {
      const resolvedCode = extractBatchCode(value);

      if (!resolvedCode) {
        throw new Error("Enter a batch code or upload a QR image first");
      }

      const data = await traceabilityApi.verifyTrace(resolvedCode);
      setResult(data);
      setBatchCode(resolvedCode);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
      setResult(null);
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    await verifyValue(batchCode);
  }

  async function handleQrUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setScanStatus("Scanning QR image...");
      setError("");

      const rawValue = await decodeQrImage(file);
      const resolvedCode = extractBatchCode(rawValue);

      if (!resolvedCode) {
        throw new Error("The QR code does not contain a readable batch code");
      }

      setBatchCode(resolvedCode);
      setScanStatus(`QR detected: ${resolvedCode}`);
      await verifyValue(resolvedCode);
    } catch (requestError) {
      setError(requestError.message);
      setResult(null);
      setScanStatus("");
    } finally {
      event.target.value = "";
    }
  }

  function formatDate(value) {
    if (!value) {
      return "Not recorded";
    }

    return new Date(value).toLocaleString();
  }

  return (
    <main className="page-layout verify-layout verify-layout-wide">
      <section className="panel-card verify-search-card">
        <p className="section-kicker">Verify authenticity</p>
        <h1>Check a herb batch by QR code or batch number</h1>
        <form className="form-grid" onSubmit={handleVerify}>
          <label className="span-two">
            Batch code
            <input onChange={(event) => setBatchCode(event.target.value)} value={batchCode} />
          </label>
          <label className="span-two">
            Upload QR code image
            <input accept="image/*" onChange={handleQrUpload} type="file" />
          </label>
          {scanStatus ? <div className="info-banner span-two">{scanStatus}</div> : null}
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Verify batch
          </button>
        </form>

      </section>

      {result ? (
        <section className="panel-card verify-result-panel span-two">
          <div className="section-header">
            <div>
              <p className="section-kicker">Complete traceability report</p>
              <h2>{result.herbName}</h2>
              <p className="muted-copy">
                {result.batchNo ? `Batch no. ${result.batchNo} | ` : ""}
                {result.batchCode}
              </p>
            </div>
            <span className="status-dot">{result.trustStatus}</span>
          </div>

          <div className="trace-summary-grid">
            <article className="stat-box">
              <span>Current stage</span>
              <strong>{result.currentStage}</strong>
            </article>
            <article className="stat-box">
              <span>Quality score</span>
              <strong>{result.qualityScore ?? "--"}%</strong>
            </article>
            <article className="stat-box">
              <span>AYUSH status</span>
              <strong>{result.compliance?.certificateStatus || "Pending"}</strong>
            </article>
            <article className="stat-box">
              <span>Ledger</span>
              <strong>{result.blockchain?.status || "Pending"}</strong>
            </article>
          </div>

          <div className="trace-detail-grid">
            <article className="verify-card">
              <p className="section-kicker">Harvesting details</p>
              <h3>{result.botanicalName || "Botanical name not recorded"}</h3>
              <p>Collector: {result.collectorName || "Not recorded"}</p>
              <p>Source type: {result.sourceType || "Not recorded"}</p>
              <p>Quantity: {result.quantityKg ? `${result.quantityKg} kg` : "Not recorded"}</p>
              <p>Harvest date: {formatDate(result.harvestDate)}</p>
              <p>Origin: {result.origin?.region || "Not recorded"}</p>
              <p>
                Geo tag: {result.origin?.geo?.latitude || "--"}, {result.origin?.geo?.longitude || "--"}
              </p>
            </article>

            <article className="verify-card">
              <p className="section-kicker">Lab report</p>
              {result.labReports?.length ? (
                <div className="log-list">
                  {result.labReports.slice().reverse().map((report) => (
                    <div className="log-entry" key={report._id || report.reportId}>
                      <div className="log-entry-head">
                        <strong>{report.reportId}</strong>
                        <span>{report.result}</span>
                      </div>
                      <p className="muted-copy">
                        {report.labName} verified purity {report.purityPercent}% and moisture{" "}
                        {report.moisturePercent}%.
                      </p>
                      <p className="muted-copy">{report.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">No laboratory report has been attached yet.</p>
              )}
            </article>

            <article className="verify-card">
              <p className="section-kicker">Manufacturing details</p>
              {result.processingLog?.length ? (
                <div className="log-list">
                  {result.processingLog.slice().reverse().map((process) => (
                    <div className="log-entry" key={process._id || process.processCode}>
                      <div className="log-entry-head">
                        <strong>{process.processCode}</strong>
                        <span>{process.packagingStatus}</span>
                      </div>
                      <p className="muted-copy">
                        {process.formulationName} by {process.manufacturerName}.
                      </p>
                      <p className="muted-copy">{process.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">No manufacturing record has been attached yet.</p>
              )}
            </article>

            <article className="verify-card">
              <p className="section-kicker">Blockchain verification</p>
              <p>Network: {result.blockchain?.network || "Simulated Ledger"}</p>
              <p>Anchored: {result.blockchain?.isAnchored ? "Yes" : "No"}</p>
              <p>Status: {result.blockchain?.status || "Pending"}</p>
              <p className="hash-text">TX hash: {result.blockchain?.txHash || "Pending"}</p>
              <p className="muted-copy">{result.blockchain?.anchorNotes}</p>
            </article>

            <article className="verify-card span-two">
              <p className="section-kicker">Audit timeline</p>
              {result.auditLog?.length ? (
                <div className="log-list">
                  {result.auditLog.slice().reverse().map((entry) => (
                    <div className="log-entry" key={entry._id || `${entry.action}-${entry.createdAt}`}>
                      <div className="log-entry-head">
                        <strong>{entry.action}</strong>
                        <span>{formatDate(entry.createdAt)}</span>
                      </div>
                      <p className="muted-copy">
                        {entry.actor} ({entry.role}) {entry.summary}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted-copy">No audit entries have been recorded yet.</p>
              )}
            </article>
          </div>
        </section>
      ) : null}
    </main>
  );
}

export default ScanQR;
