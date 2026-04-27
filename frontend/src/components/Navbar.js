import { Blocks, Leaf, LogOut, Settings, ShieldCheck } from "lucide-react";

function navButton(label, route, activeRoute, onNavigate) {
  return (
    <button
      className={`nav-link ${activeRoute === route ? "active" : ""}`}
      key={route}
      onClick={() => onNavigate(route)}
      type="button"
    >
      {label}
    </button>
  );
}

function navItemsForRole(role) {
  if (role === "Lab") {
    return [
      {
        label: "Portal Home",
        route: "home"
      },
      {
        label: "Lab Dashboard",
        route: "labDashboard"
      },
      {
        label: "Customer Verify",
        route: "verify"
      }
    ];
  }

  if (role === "Manufacturer") {
    return [
      {
        label: "Portal Home",
        route: "home"
      },
      {
        label: "Operations",
        route: "manufacturerDashboard"
      },
      {
        label: "Customer Verify",
        route: "verify"
      }
    ];
  }

  return [
    {
      label: "Portal Home",
      route: "home"
    },
    {
      label: "My Harvests",
      route: "farmerDashboard"
    },
    {
      label: "Customer Verify",
      route: "verify"
    }
  ];
}

function Navbar({ route, session, onNavigate, onLogout }) {
  const roleItems = session.user ? navItemsForRole(session.user.role) : [];

  return (
    <header className="navbar">
      <button className="brand-mark" onClick={() => onNavigate("home")} type="button">
        <span className="brand-icon">
          <Leaf size={18} />
        </span>
        <span className="brand-text">Herb Portal</span>
      </button>

      <nav className="nav-links">
        {session.user
          ? roleItems.map((item) => navButton(item.label, item.route, route, onNavigate))
          : null}
        {!session.user ? navButton("Portals", "home", route, onNavigate) : null}
      </nav>

      <div className="nav-actions">
        {session.user ? (
          <>
            <div className="badge-pill">
              <ShieldCheck size={16} />
              <span>{session.user.role}</span>
            </div>
            <button className="logout-button" onClick={onLogout} type="button">
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="badge-pill nav-badge-quiet">
              <Blocks size={16} />
              <span>Portals</span>
            </div>
            <button className="settings-button" type="button">
              <Settings size={16} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
