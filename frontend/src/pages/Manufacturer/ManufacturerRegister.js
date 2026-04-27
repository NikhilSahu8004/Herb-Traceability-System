import { useState } from "react";

function ManufacturerRegister({ onRegister, error, setRoute }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    plantLocation: "",
    role: "Manufacturer"
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onRegister(form);
  }

  return (
    <main className="page-layout auth-page auth-page-centered">
      <section className="panel-card auth-card auth-card-dark">
        <p className="section-kicker">Manufacturer Portal</p>
        <h1>Create a manufacturer account</h1>
        <p className="muted-copy">
          Register a production workspace to move verified herbs into formulation, packaging, and dispatch.
        </p>
        <div className="info-banner">New accounts created here are saved as Manufacturer users only.</div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="span-two">
            Company or manager name
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
            Plant location
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, plantLocation: event.target.value }))
              }
              required
              value={form.plantLocation}
            />
          </label>
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Register manufacturer
          </button>
        </form>
        <button className="text-button" onClick={() => setRoute("manufacturerLogin")} type="button">
          Already have a manufacturer account? Login here
        </button>
      </section>
    </main>
  );
}

export default ManufacturerRegister;
