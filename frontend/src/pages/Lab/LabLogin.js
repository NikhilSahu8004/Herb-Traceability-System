import { useState } from "react";

function LabLogin({ onLogin, error, setRoute }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();
    await onLogin({
      ...form,
      expectedRole: "Lab"
    });
  }

  return (
    <main className="page-layout auth-page auth-page-centered">
      <section className="panel-card auth-card auth-card-dark">
        <p className="section-kicker">Laboratory Portal</p>
        <h1>Login to laboratory verification</h1>
        <p className="muted-copy">
          Upload quality reports, verify purity, and approve tested herb batches.
        </p>
        <div className="info-banner">This portal accepts Laboratory accounts only.</div>
        <form className="form-grid" onSubmit={handleSubmit}>
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
          {error ? <div className="error-banner span-two">{error}</div> : null}
          <button className="primary-button span-two" type="submit">
            Login
          </button>
        </form>
        <button className="text-button" onClick={() => setRoute("labRegister")} type="button">
          New laboratory user? Create account
        </button>
      </section>
    </main>
  );
}

export default LabLogin;
