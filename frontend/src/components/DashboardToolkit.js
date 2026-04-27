import { API_BASE_URL } from "../services/api";

export function applyBatchFilters(batches, filters) {
  const searchTerm = filters.search.trim().toLowerCase();

  return batches.filter((batch) => {
    const matchesSearch =
      !searchTerm ||
      [batch.batchCode, batch.batchNo, batch.herbName, batch.origin?.region]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(searchTerm));
    const matchesRegion = filters.region === "All" || batch.origin?.region === filters.region;
    const matchesStage = filters.stage === "All" || batch.currentStage === filters.stage;
    const matchesQuality = (batch.qualityMetrics?.overallScore || 0) >= Number(filters.minQuality || 0);

    return matchesSearch && matchesRegion && matchesStage && matchesQuality;
  });
}

export function buildDashboardAnalytics(batches) {
  const totalBatches = batches.length;
  const verifiedBatches = batches.filter((batch) => (batch.qualityMetrics?.overallScore || 0) >= 85).length;
  const averageQuality = totalBatches
    ? Math.round(
        batches.reduce((sum, batch) => sum + (batch.qualityMetrics?.overallScore || 0), 0) / totalBatches
      )
    : 0;

  const regionActivity = Object.entries(
    batches.reduce((accumulator, batch) => {
      const region = batch.origin?.region || "Unknown";
      accumulator[region] = (accumulator[region] || 0) + 1;
      return accumulator;
    }, {})
  ).sort((left, right) => right[1] - left[1]);

  const qualityBands = {
    high: batches.filter((batch) => (batch.qualityMetrics?.overallScore || 0) >= 90).length,
    medium: batches.filter((batch) => {
      const score = batch.qualityMetrics?.overallScore || 0;
      return score >= 75 && score < 90;
    }).length,
    review: batches.filter((batch) => (batch.qualityMetrics?.overallScore || 0) < 75).length
  };

  return {
    totalBatches,
    verifiedBatches,
    verificationRate: totalBatches ? Math.round((verifiedBatches / totalBatches) * 100) : 0,
    averageQuality,
    regionActivity,
    qualityBands
  };
}

export function SearchFiltersPanel({ filters, batches, onChange }) {
  const regions = ["All", ...new Set(batches.map((batch) => batch.origin?.region).filter(Boolean))];
  const stages = ["All", ...new Set(batches.map((batch) => batch.currentStage).filter(Boolean))];

  return (
    <section className="panel-card span-two">
      <div className="section-header">
        <div>
          <p className="section-kicker">Search and filters</p>
          <h2>Find the exact traceability record</h2>
        </div>
        <span className="status-dot">{batches.length} records</span>
      </div>
      <div className="filter-grid">
        <label>
          Search
          <input
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Batch code, batch no., herb name, or region"
            value={filters.search}
          />
        </label>
        <label>
          Region
          <select onChange={(event) => onChange("region", event.target.value)} value={filters.region}>
            {regions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
        </label>
        <label>
          Stage
          <select onChange={(event) => onChange("stage", event.target.value)} value={filters.stage}>
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
        </label>
        <label>
          Minimum quality score
          <select
            onChange={(event) => onChange("minQuality", event.target.value)}
            value={filters.minQuality}
          >
            <option value="0">All scores</option>
            <option value="70">70 and above</option>
            <option value="80">80 and above</option>
            <option value="90">90 and above</option>
          </select>
        </label>
      </div>
    </section>
  );
}

export function AnalyticsPanel({ batches }) {
  const analytics = buildDashboardAnalytics(batches);

  return (
    <section className="panel-card">
      <p className="section-kicker">Analytics</p>
      <h3>Quality and verification snapshot</h3>
      <div className="analytics-stack">
        <div className="analytics-row">
          <span>Total batches</span>
          <strong>{analytics.totalBatches}</strong>
        </div>
        <div className="analytics-row">
          <span>Verification rate</span>
          <strong>{analytics.verificationRate}%</strong>
        </div>
        <div className="analytics-row">
          <span>Average quality</span>
          <strong>{analytics.averageQuality}%</strong>
        </div>
      </div>
      <div className="mini-chart">
        <div>
          <span>High quality</span>
          <strong>{analytics.qualityBands.high}</strong>
        </div>
        <div>
          <span>Medium quality</span>
          <strong>{analytics.qualityBands.medium}</strong>
        </div>
        <div>
          <span>Needs review</span>
          <strong>{analytics.qualityBands.review}</strong>
        </div>
      </div>
      <div className="tag-list">
        {analytics.regionActivity.length ? (
          analytics.regionActivity.slice(0, 4).map(([region, count]) => (
            <span key={region}>{`${region}: ${count}`}</span>
          ))
        ) : (
          <span>No region activity yet</span>
        )}
      </div>
    </section>
  );
}

export function QRManagementPanel({ selectedBatch }) {
  if (!selectedBatch?._id) {
    return (
      <section className="panel-card">
        <p className="section-kicker">QR management</p>
        <h3>No batch selected yet</h3>
        <p className="muted-copy">Select a batch to preview, open, and download its QR verification code.</p>
      </section>
    );
  }

  const qrUrl = `${API_BASE_URL}/batches/${selectedBatch._id}/qr`;

  return (
    <section className="panel-card">
      <p className="section-kicker">QR management</p>
      <h3>{selectedBatch.batchCode}</h3>
      {selectedBatch.batchNo ? <p className="muted-copy">Batch no. {selectedBatch.batchNo}</p> : null}
      <img alt={`${selectedBatch.batchCode} QR`} className="qr-preview" src={qrUrl} />
      <div className="button-row">
        <a className="ghost-button" href={qrUrl} rel="noreferrer" target="_blank">
          Open QR
        </a>
        <a className="ghost-button" download={`${selectedBatch.batchCode}.png`} href={qrUrl}>
          Download QR
        </a>
      </div>
      <p className="muted-copy">
        Payload is tied to {selectedBatch.herbName} from {selectedBatch.origin?.region}.
      </p>
    </section>
  );
}

export function BlockchainStatusPanel({ selectedBatch }) {
  if (!selectedBatch?._id) {
    return (
      <section className="panel-card">
        <p className="section-kicker">Blockchain status</p>
        <h3>No blockchain checkpoint yet</h3>
        <p className="muted-copy">Choose a batch to inspect anchor readiness and transaction history.</p>
      </section>
    );
  }

  const blockchain = selectedBatch.blockchain || {};

  return (
    <section className="panel-card">
      <p className="section-kicker">Blockchain status</p>
      <h3>{blockchain.status || "Pending"}</h3>
      <div className="analytics-stack">
        <div className="analytics-row">
          <span>Network</span>
          <strong>{blockchain.network || "Simulated Ledger"}</strong>
        </div>
        <div className="analytics-row">
          <span>Anchored</span>
          <strong>{blockchain.isAnchored ? "Yes" : "No"}</strong>
        </div>
        <div className="analytics-row">
          <span>TX hash</span>
          <strong className="hash-text">{blockchain.txHash || "Pending"}</strong>
        </div>
      </div>
      <p className="muted-copy">
        {blockchain.anchorNotes || "Anchor notes will appear after manufacturing confirmation."}
      </p>
    </section>
  );
}

function DeleteSelectedProductAction({ onDeleteBatch, selectedBatch }) {
  if (!selectedBatch?._id || !onDeleteBatch) {
    return null;
  }

  return (
    <div className="panel-danger-action">
      <button className="danger-button" onClick={() => onDeleteBatch(selectedBatch)} type="button">
        Delete selected product
      </button>
    </div>
  );
}

export function LabReportsPanel({ onDeleteBatch, selectedBatch }) {
  const reports = selectedBatch?.labReports || [];

  return (
    <section className="panel-card">
      <p className="section-kicker">Lab reports</p>
      <h3>Verification reports</h3>
      {selectedBatch ? (
        <p className="muted-copy">
          Product: {selectedBatch.batchNo || selectedBatch.batchCode} - {selectedBatch.herbName}
        </p>
      ) : null}
      {reports.length ? (
        <div className="log-list">
          {reports.slice().reverse().map((report) => (
            <article className="log-entry" key={report._id || report.reportId}>
              <div className="log-entry-head">
                <strong>{report.reportId}</strong>
                <span>{report.result}</span>
              </div>
              <p className="muted-copy">
                {report.labName} recorded purity {report.purityPercent}% and moisture {report.moisturePercent}%.
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="muted-copy">No lab reports are attached to this batch yet.</p>
      )}
      <DeleteSelectedProductAction onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
    </section>
  );
}

export function AuditLogPanel({ onDeleteBatch, selectedBatch }) {
  const entries = selectedBatch?.auditLog || [];

  return (
    <section className="panel-card">
      <p className="section-kicker">Audit log</p>
      <h3>Who updated what and when</h3>
      {selectedBatch ? (
        <p className="muted-copy">
          Product: {selectedBatch.batchNo || selectedBatch.batchCode} - {selectedBatch.herbName}
        </p>
      ) : null}
      {entries.length ? (
        <div className="log-list">
          {entries.slice().reverse().map((entry) => (
            <article className="log-entry" key={entry._id || `${entry.action}-${entry.createdAt}`}>
              <div className="log-entry-head">
                <strong>{entry.action}</strong>
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <p className="muted-copy">
                {entry.actor} ({entry.role}) {entry.summary}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="muted-copy">Audit entries will appear as the batch moves through each checkpoint.</p>
      )}
      <DeleteSelectedProductAction onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
    </section>
  );
}
