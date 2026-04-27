import { Factory, FlaskConical, Leaf, QrCode, ShieldCheck, Truck } from "lucide-react";

const portals = [
  {
    title: "Farmer Portal",
    description: "Register herbs, geo-tag harvest sources, and create traceable batches.",
    route: "farmerLogin",
    icon: Leaf
  },
  {
    title: "Laboratory Portal",
    description: "Upload quality reports, verify purity, and approve tested batches.",
    route: "labLogin",
    icon: FlaskConical
  },
  {
    title: "Manufacturer Portal",
    description: "Move verified herbs into formulation, packaging, and dispatch flows.",
    route: "manufacturerLogin",
    icon: Factory
  },
  {
    title: "Customer Verify",
    description: "Scan QR or enter a batch code to validate herb authenticity instantly.",
    route: "verify",
    icon: QrCode
  }
];

const highlights = [
  {
    label: "Geo-tagged Origin",
    detail: "Map linked collection points for every batch.",
    icon: Truck,
    route: "farmerLogin",
    action: "Open Farmer Geo-tagging"
  },
  {
    label: "Trusted Verification",
    detail: "Lab-tested records and compliance-driven checkpoints.",
    icon: ShieldCheck,
    route: "verify",
    action: "Open Verification"
  }
];

function Home({ setRoute }) {
  return (
    <main className="page-layout portal-home">
      <section className="portal-hero">
        <div className="portal-hero-inner">
          <p className="section-kicker">Transparent Herb Ecosystem</p>
          <h1>Herb Portal</h1>
          <p className="lead-copy portal-lead">
            Connecting farmers, laboratories, manufacturers, and customers in a
            transparent herb ecosystem.
          </p>
          <div className="hero-actions hero-actions-centered">
            <button className="primary-button" onClick={() => setRoute("farmerLogin")} type="button">
              Get Started
            </button>
            <button className="ghost-button" onClick={() => setRoute("verify")} type="button">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <div className="section-copy centered-copy">
          <h2>Access Your Portal</h2>
          <p className="lead-copy">
            Select your role to access the dedicated portal with tools and features tailored to your needs.
          </p>
        </div>

        <div className="portal-grid">
          {portals.map((portal) => {
            const Icon = portal.icon;

            return (
              <button
                className="portal-card"
                key={portal.title}
                onClick={() => setRoute(portal.route)}
                type="button"
              >
                <span className="portal-card-icon">
                  <Icon size={18} />
                </span>
                <h3>{portal.title}</h3>
                <p className="muted-copy">{portal.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="portal-section portal-insights">
        {highlights.map((item) => {
          const Icon = item.icon;

          return (
            <button
              className="insight-card insight-card-button"
              key={item.label}
              onClick={() => setRoute(item.route)}
              type="button"
            >
              <span className="portal-card-icon">
                <Icon size={18} />
              </span>
              <div>
                <h3>{item.label}</h3>
                <p className="muted-copy">{item.detail}</p>
                <span className="insight-action">{item.action}</span>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
}

export default Home;
