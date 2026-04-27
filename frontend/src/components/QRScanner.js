import { API_BASE_URL } from "../services/api";

function QRScanner({ selectedBatch }) {
  if (!selectedBatch?._id) {
    return (
      <div className="panel-card">
        <p className="section-kicker">QR verification</p>
        <h3>No batch selected yet</h3>
        <p className="muted-copy">Choose a batch to preview its QR verification asset.</p>
      </div>
    );
  }

  const qrUrl = `${API_BASE_URL}/batches/${selectedBatch._id}/qr`;

  return (
    <div className="panel-card">
      <p className="section-kicker">QR verification</p>
      <h3>Batch verification code</h3>
      <img alt={`${selectedBatch.batchCode} QR`} className="qr-preview" src={qrUrl} />
      <a className="ghost-button" href={qrUrl} rel="noreferrer" target="_blank">
        Open generated QR
      </a>
    </div>
  );
}

export default QRScanner;
