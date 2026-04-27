import { Blocks, FlaskConical, Leaf, QrCode } from "lucide-react";

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <div className="footer-brand-top">
          <span className="brand-icon">
            <Leaf size={18} />
          </span>
          <div>
            <strong>Herb Portal</strong>
            <p className="muted-copy">
              Botanical traceability for farmers, laboratories, manufacturers, and customers.
            </p>
          </div>
        </div>
        <div className="footer-tags">
          <span><Blocks size={14} /> Blockchain-ready</span>
          <span><QrCode size={14} /> QR verification</span>
          <span><FlaskConical size={14} /> Lab-tested flow</span>
        </div>
      </div>

      <div className="footer-links">
        <div>
          <p className="section-kicker">Portals</p>
          <button className="footer-link" onClick={() => onNavigate("farmerLogin")} type="button">
            Farmer Login
          </button>
          <button className="footer-link" onClick={() => onNavigate("labLogin")} type="button">
            Lab Login
          </button>
          <button
            className="footer-link"
            onClick={() => onNavigate("manufacturerLogin")}
            type="button"
          >
            Manufacturer Login
          </button>
        </div>

        <div>
          <p className="section-kicker">Verification</p>
          <button className="footer-link" onClick={() => onNavigate("verify")} type="button">
            Check by QR
          </button>
          <button className="footer-link" onClick={() => onNavigate("verify")} type="button">
            Check by Batch Code
          </button>
        </div>

        <div>
          <p className="section-kicker">Project Scope</p>
          <p className="muted-copy">Geo-tagged collection</p>
          <p className="muted-copy">Supply chain trace events</p>
          <p className="muted-copy">MongoDB-backed records</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
