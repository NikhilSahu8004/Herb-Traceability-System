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

const initialBatch = {
  herbName: "",
  botanicalName: "",
  batchCode: "",
  batchNo: "",
  collectorName: "Nikhil Sahu",
  sourceType: "Cultivated",
  region: "",
  latitude: "",
  longitude: "",
  harvestDate: "",
  quantityKg: "",
  ayushStatus: "Pending"
};

function FarmerDashboard({
  session,
  batches,
  selectedBatch,
  onCreateBatch,
  onDeleteBatch,
  onSelectBatch,
  error
}) {
  const [filters, setFilters] = useState({
    search: "",
    region: "All",
    stage: "All",
    minQuality: "0"
  });
  const [form, setForm] = useState({
    ...initialBatch,
    collectorName: session.user?.name || initialBatch.collectorName
  });
  const filteredBatches = useMemo(() => applyBatchFilters(batches, filters), [batches, filters]);

  async function handleSubmit(event) {
    event.preventDefault();
    await onCreateBatch({
      ...form,
      quantityKg: Number(form.quantityKg),
      latitude: Number(form.latitude),
      longitude: Number(form.longitude)
    });
    setForm({
      ...initialBatch,
      collectorName: session.user?.name || initialBatch.collectorName
    });
  }

  function handleFilterChange(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="page-layout dashboard-layout">
      <section className="panel-card">
        <p className="section-kicker">Farmer dashboard</p>
        <h1>Create geo-tagged harvest batches</h1>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Herb name
            <input
              onChange={(event) => setForm((current) => ({ ...current, herbName: event.target.value }))}
              required
              value={form.herbName}
            />
          </label>
          <label>
            Botanical name
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, botanicalName: event.target.value }))
              }
              required
              value={form.botanicalName}
            />
          </label>
          <label>
            Batch code
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, batchCode: event.target.value }))
              }
              required
              value={form.batchCode}
            />
          </label>
          <label>
            Batch no.
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, batchNo: event.target.value }))
              }
              placeholder="Example: BN-001"
              required
              value={form.batchNo}
            />
          </label>
          <label>
            Harvest date
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, harvestDate: event.target.value }))
              }
              required
              type="date"
              value={form.harvestDate}
            />
          </label>
          <label className="span-two">
            Region
            <input
              onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
              required
              value={form.region}
            />
          </label>
          <label>
            Latitude
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, latitude: event.target.value }))
              }
              required
              type="number"
              value={form.latitude}
            />
          </label>
          <label>
            Longitude
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, longitude: event.target.value }))
              }
              required
              type="number"
              value={form.longitude}
            />
          </label>
          <label>
            Quantity (kg)
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, quantityKg: event.target.value }))
              }
              required
              type="number"
              value={form.quantityKg}
            />
          </label>
          <label>
            Source type
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, sourceType: event.target.value }))
              }
              value={form.sourceType}
            >
              <option>Cultivated</option>
              <option>Wild Collection</option>
              <option>Contract Farm</option>
            </select>
          </label>
          <label>
            AYUSH status
            <select
              onChange={(event) =>
                setForm((current) => ({ ...current, ayushStatus: event.target.value }))
              }
              value={form.ayushStatus}
            >
              <option>Verified</option>
              <option>Submitted</option>
              <option>Under Review</option>
              <option>Pending</option>
            </select>
          </label>
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Save batch
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
        <p className="section-kicker">My batches</p>
        <h2>Registered harvest lots</h2>
        <p className="muted-copy">
          Showing {filteredBatches.length} of {batches.length} traceability records.
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
          <div className="info-banner">No batches match the selected search and filter criteria.</div>
        ) : null}
      </section>
    </main>
  );
}

export default FarmerDashboard;
