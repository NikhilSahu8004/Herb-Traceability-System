function BatchCard({ batch, active, onDelete, onSelect }) {
  return (
    <article className={`batch-card ${active ? "active" : ""}`}>
      <button className="batch-card-select" onClick={() => onSelect(batch._id)} type="button">
        <div>
          <p className="section-kicker">{batch.batchCode}</p>
          <h3>{batch.herbName}</h3>
        </div>
        <span className="status-dot">{batch.currentStage}</span>
      </button>
      <p className="muted-copy">{batch.botanicalName}</p>
      <div className="batch-meta">
        {batch.batchNo ? <span>Batch no. {batch.batchNo}</span> : null}
        <span>{batch.origin.region}</span>
        <span>{batch.qualityMetrics.overallScore}% score</span>
        <span>{batch.compliance?.certificateStatus || "Pending"}</span>
      </div>
      {onDelete ? (
        <div className="batch-actions">
          <button className="danger-button" onClick={() => onDelete(batch)} type="button">
            Delete product
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default BatchCard;
