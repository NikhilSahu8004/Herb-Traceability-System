import { useState } from "react";

function FarmerRegister({ onRegister, error, setRoute }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    farmLocation: "",
    role: "Farmer"
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onRegister(form);
  }

  return (
    <main className="page-layout auth-page auth-page-centered">
      <section className="panel-card auth-card auth-card-dark">
        <p className="section-kicker">Farmer Portal</p>
        <h1>Create a traceable farmer account</h1>
        <p className="muted-copy">
          Register your account to geo-tag harvest sources and create blockchain-ready herb batches.
        </p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="span-two">
            Full name
            <input
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              value={form.name}
            />
          </label>
          <label className="span-two">
            Email
            <input
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label className="span-two">
            Password
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
              type="password"
              value={form.password}
            />
          </label>
          <label className="span-two">
            Farm location
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, farmLocation: event.target.value }))
              }
              required
              value={form.farmLocation}
            />
          </label>
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Register farmer
          </button>
        </form>
        <button className="text-button" onClick={() => setRoute("farmerLogin")} type="button">
          Already have an account? Login here
        </button>
      </section>
    </main>
  );
}

export default FarmerRegister;
