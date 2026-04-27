function MapView({ selectedBatch }) {
  const geo = selectedBatch?.origin?.geo;
  const mapsUrl = geo
    ? `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`
    : "";

  return (
    <div className="panel-card">
      <p className="section-kicker">Geo-tagging</p>
      <h3>Origin map snapshot</h3>
      {geo ? (
        <>
          <div className="map-view">
            <div className="map-grid" />
            <div className="map-pin" style={{ left: "56%", top: "42%" }} />
          </div>
          <p className="muted-copy">
            {selectedBatch.origin.region} • Lat {geo.latitude} / Lng {geo.longitude}
          </p>
          <a className="ghost-button" href={mapsUrl} rel="noreferrer" target="_blank">
            Open exact coordinates
          </a>
        </>
      ) : (
        <p className="muted-copy">Location data will appear here when a batch is selected.</p>
      )}
    </div>
  );
}

export default MapView;
