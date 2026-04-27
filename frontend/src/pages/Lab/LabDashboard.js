import { useMemo, useState } from "react";
import BatchCard from "../../components/BatchCard";
import {
  AnalyticsPanel,
  applyBatchFilters,
  AuditLogPanel,
  BlockchainStatusPanel,
  LabReportsPanel,
  QRManagementPanel,
  SearchFiltersPanel
} from "../../components/DashboardToolkit";

const initialForm = {
  stage: "Testing",
  actor: "Quality Lab",
  location: "Lab Facility",
  notes: "Identity and quality markers verified.",
  temperatureCelsius: "24",
  humidityPercent: "40",
  reportId: "LAB-2026-001",
  purityPercent: "95",
  moisturePercent: "8",
  result: "Pass"
};

function LabDashboard({
  batches,
  selectedBatch,
  onDeleteBatch,
  onSelectBatch,
  onAddBatchEvent,
  session,
  error
}) {
  const [filters, setFilters] = useState({
    search: "",
    region: "All",
    stage: "All",
    minQuality: "0"
  });
  const [form, setForm] = useState({
    ...initialForm,
    actor: session.user?.name || initialForm.actor
  });
  const filteredBatches = useMemo(() => applyBatchFilters(batches, filters), [batches, filters]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedBatch?._id) {
      return;
    }

    await onAddBatchEvent(selectedBatch._id, {
      ...form,
      temperatureCelsius: Number(form.temperatureCelsius),
      humidityPercent: Number(form.humidityPercent),
      labReport: {
        reportId: form.reportId,
        purityPercent: Number(form.purityPercent),
        moisturePercent: Number(form.moisturePercent),
        result: form.result
      }
    });
  }

  function handleFilterChange(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function handleProductChange(batchId) {
    if (!batchId) {
      return;
    }

    onSelectBatch(batchId);
  }

  return (
    <main className="page-layout dashboard-layout">
      <section className="panel-card">
        <p className="section-kicker">Lab dashboard</p>
        <h1>Attach quality verification reports</h1>
        {selectedBatch ? (
          <div className="info-banner">
            Testing batch <strong>{selectedBatch.batchNo || selectedBatch.batchCode}</strong> for{" "}
            {selectedBatch.herbName}.
          </div>
        ) : (
          <div className="info-banner">Select a product or batch before submitting a laboratory report.</div>
        )}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="span-two">
            Select product / batch no.
            <select
              onChange={(event) => handleProductChange(event.target.value)}
              required
              value={selectedBatch?._id || ""}
            >
              <option value="">Choose product for report</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.batchNo || batch.batchCode} - {batch.herbName} ({batch.origin?.region})
                </option>
              ))}
            </select>
          </label>
          <label>
            Report ID
            <input
              onChange={(event) => setForm((current) => ({ ...current, reportId: event.target.value }))}
              value={form.reportId}
            />
          </label>
          <label>
            Result
            <select
              onChange={(event) => setForm((current) => ({ ...current, result: event.target.value }))}
              value={form.result}
            >
              <option>Pass</option>
              <option>Review</option>
              <option>Fail</option>
            </select>
          </label>
          <label className="span-two">
            Lab notes
            <textarea
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows="4"
              value={form.notes}
            />
          </label>
          <label>
            Purity %
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, purityPercent: event.target.value }))
              }
              type="number"
              value={form.purityPercent}
            />
          </label>
          <label>
            Moisture %
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, moisturePercent: event.target.value }))
              }
              type="number"
              value={form.moisturePercent}
            />
          </label>
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" disabled={!selectedBatch} type="submit">
            Submit lab report
          </button>
        </form>
      </section>

      <AnalyticsPanel batches={filteredBatches} />
      <QRManagementPanel selectedBatch={selectedBatch} />
      <BlockchainStatusPanel selectedBatch={selectedBatch} />
      <LabReportsPanel onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
      <AuditLogPanel onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
      <SearchFiltersPanel batches={batches} filters={filters} onChange={handleFilterChange} />

      <section className="panel-card span-two">
        <p className="section-kicker">Batch queue</p>
        <h2>Select a batch for testing</h2>
        <p className="muted-copy">
          Showing {filteredBatches.length} of {batches.length} batches for laboratory work.
        </p>
        <div className="batch-card-grid">
          {filteredBatches.map((batch) => (
            <BatchCard
              active={selectedBatch?._id === batch._id}
              batch={batch}
              key={batch._id}
              onDelete={onDeleteBatch}
              onSelect={onSelectBatch}
            />
          ))}
        </div>
        {!filteredBatches.length ? (
          <div className="info-banner">No lab batches match the selected filters.</div>
        ) : null}
      </section>
    </main>
  );
}

export default LabDashboard;
