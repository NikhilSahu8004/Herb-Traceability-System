import { useState } from "react";

function FarmerLogin({ onLogin, setRoute, error }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onLogin({
      ...form,
      expectedRole: "Farmer"
    });
  }

  return (
    <main className="page-layout auth-page auth-page-centered">
      <section className="panel-card auth-card auth-card-dark">
        <p className="section-kicker">Farmer Portal</p>
        <h1>Login to your farmer workspace</h1>
        <p className="muted-copy">
          Access your registered herbs, geo-tagged origins, and traceable batch records.
        </p>
        <div className="info-banner">This portal accepts Farmer accounts only.</div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
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
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Login
          </button>
        </form>
        <button className="text-button" onClick={() => setRoute("farmerRegister")} type="button">
          New farmer? Register here
        </button>
      </section>
    </main>
  );
}

export default FarmerLogin;
