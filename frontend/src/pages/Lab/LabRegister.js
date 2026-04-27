import { useState } from "react";

function LabRegister({ onRegister, error, setRoute }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    labLocation: "",
    role: "Lab"
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onRegister(form);
  }

  return (
    <main className="page-layout auth-page auth-page-centered">
      <section className="panel-card auth-card auth-card-dark">
        <p className="section-kicker">Laboratory Portal</p>
        <h1>Create a laboratory account</h1>
        <p className="muted-copy">
          Register a lab profile to upload quality reports, verify herb purity, and approve tested batches.
        </p>
        <div className="info-banner">New accounts created here are saved as Laboratory users only.</div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="span-two">
            Laboratory or officer name
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
            Lab location
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, labLocation: event.target.value }))
              }
              required
              value={form.labLocation}
            />
          </label>
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Register laboratory
          </button>
        </form>
        <button className="text-button" onClick={() => setRoute("labLogin")} type="button">
          Already have a lab account? Login here
        </button>
      </section>
    </main>
  );
}

export default LabRegister;
