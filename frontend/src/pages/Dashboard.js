import BatchCard from "../components/BatchCard";
import MapView from "../components/MapView";
import QRScanner from "../components/QRScanner";

function Dashboard({ dashboard, batches, selectedBatch, onDeleteBatch, onSelectBatch, error, loading }) {
  const overview = dashboard?.overview;

  return (
    <main className="page-layout dashboard-layout">
      <section className="panel-card span-two">
        <p className="section-kicker">System dashboard</p>
        <h1>Operational command center</h1>
        <p className="lead-copy">
          Monitor quality, supply chain progress, and verification readiness across all herb batches.
        </p>
        <div className="stats-grid">
          <article className="stat-box">
            <span>Total batches</span>
            <strong>{overview?.totalBatches ?? "--"}</strong>
          </article>
          <article className="stat-box">
            <span>Verified batches</span>
            <strong>{overview?.verifiedBatches ?? "--"}</strong>
          </article>
          <article className="stat-box">
            <span>Events logged</span>
            <strong>{overview?.totalEvents ?? "--"}</strong>
          </article>
          <article className="stat-box">
            <span>Compliance rate</span>
            <strong>{overview ? `${overview.complianceRate}%` : "--"}</strong>
          </article>
        </div>
      </section>

      <MapView selectedBatch={selectedBatch} />
      <QRScanner selectedBatch={selectedBatch} />

      <section className="panel-card span-two">
        <div className="section-header">
          <div>
            <p className="section-kicker">Batch registry</p>
            <h2>Active traceability records</h2>
          </div>
          {loading ? <span className="status-dot">Loading</span> : null}
        </div>
        {error ? <div className="error-banner">{error}</div> : null}
        <div className="batch-card-grid">
          {batches.map((batch) => (
            <BatchCard
              active={selectedBatch?._id === batch._id}
              batch={batch}
              key={batch._id}
              onDelete={onDeleteBatch}
              onSelect={onSelectBatch}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
