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
import MapView from "../../components/MapView";
import { blockchainService } from "../../services/blockchain";

const initialForm = {
  stage: "Manufacturing",
  actor: "Manufacturing Unit",
  location: "Bhopal Formulation Plant",
  notes: "Batch accepted into formulation workflow.",
  temperatureCelsius: "22",
  humidityPercent: "38",
  processCode: "PROC-2026-009",
  formulationName: "Immunity Support Blend",
  packagingStatus: "In Progress"
};

function ManufacturerDashboard({
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
  const [anchorPreview, setAnchorPreview] = useState("");
  const filteredBatches = useMemo(() => applyBatchFilters(batches, filters), [batches, filters]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!selectedBatch?._id) {
      return;
    }

    const blockchainPreview = blockchainService.previewAnchor({
      batchCode: selectedBatch.batchCode,
      processCode: form.processCode
    });

    setAnchorPreview(blockchainPreview);

    await onAddBatchEvent(selectedBatch._id, {
      ...form,
      temperatureCelsius: Number(form.temperatureCelsius),
      humidityPercent: Number(form.humidityPercent),
      processing: {
        processCode: form.processCode,
        formulationName: form.formulationName,
        packagingStatus: form.packagingStatus
      }
    });
  }

  function handleFilterChange(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="page-layout dashboard-layout">
      <section className="panel-card">
        <p className="section-kicker">Manufacturer dashboard</p>
        <h1>Advance verified herbs into production</h1>
        {selectedBatch ? (
          <div className="info-banner">
            Manufacturing batch <strong>{selectedBatch.batchCode}</strong> from {selectedBatch.origin.region}.
          </div>
        ) : (
          <div className="info-banner">Select a batch below before pushing it into manufacturing.</div>
        )}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Process code
            <input
              onChange={(event) => setForm((current) => ({ ...current, processCode: event.target.value }))}
              value={form.processCode}
            />
          </label>
          <label>
            Packaging
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, packagingStatus: event.target.value }))
              }
              value={form.packagingStatus}
            >
              <option>In Progress</option>
              <option>Packed</option>
              <option>Ready for Dispatch</option>
            </select>
          </label>
          <label className="span-two">
            Formulation name
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, formulationName: event.target.value }))
              }
              value={form.formulationName}
            />
          </label>
          <label className="span-two">
            Manufacturing notes
            <textarea
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows="4"
              value={form.notes}
            />
          </label>
          {anchorPreview ? <div className="info-banner span-two">{anchorPreview}</div> : null}
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" disabled={!selectedBatch} type="submit">
            Push to manufacturing
          </button>
        </form>
      </section>

      <AnalyticsPanel batches={filteredBatches} />
      <MapView selectedBatch={selectedBatch} />
      <QRManagementPanel selectedBatch={selectedBatch} />
      <BlockchainStatusPanel selectedBatch={selectedBatch} />
      <LabReportsPanel onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
      <AuditLogPanel onDeleteBatch={onDeleteBatch} selectedBatch={selectedBatch} />
      <SearchFiltersPanel batches={batches} filters={filters} onChange={handleFilterChange} />

      <section className="panel-card span-two">
        <p className="section-kicker">Production queue</p>
        <h2>Verified herb batches</h2>
        <p className="muted-copy">
          Showing {filteredBatches.length} of {batches.length} manufacturing-ready batches.
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
          <div className="info-banner">No manufacturing batches match the selected filters.</div>
        ) : null}
      </section>
    </main>
  );
}

export default ManufacturerDashboard;
