import { useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FarmerLogin from "./pages/Farmer/FarmerLogin";
import FarmerRegister from "./pages/Farmer/FarmerRegister";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
import LabLogin from "./pages/Lab/LabLogin";
import LabRegister from "./pages/Lab/LabRegister";
import LabDashboard from "./pages/Lab/LabDashboard";
import ManufacturerLogin from "./pages/Manufacturer/ManufacturerLogin";
import ManufacturerRegister from "./pages/Manufacturer/ManufacturerRegister";
import ManufacturerDashboard from "./pages/Manufacturer/ManufacturerDashboard";
import ScanQR from "./pages/Verify/ScanQR";
import { authStorage, traceabilityApi } from "./services/api";

const publicRoutes = {
  home: Home,
  farmerLogin: FarmerLogin,
  farmerRegister: FarmerRegister,
  labLogin: LabLogin,
  labRegister: LabRegister,
  manufacturerLogin: ManufacturerLogin,
  manufacturerRegister: ManufacturerRegister,
  verify: ScanQR
};

const protectedRoutes = {
  dashboard: Dashboard,
  farmerDashboard: FarmerDashboard,
  labDashboard: LabDashboard,
  manufacturerDashboard: ManufacturerDashboard
};

function routeForRole(role) {
  if (role === "Lab") {
    return "labDashboard";
  }
  if (role === "Manufacturer") {
    return "manufacturerDashboard";
  }
  return "farmerDashboard";
}

function resolveRoute(role, currentRoute) {
  const sharedAuthenticatedRoutes = new Set([
    "home",
    "verify",
    "farmerLogin",
    "farmerRegister",
    "labLogin",
    "labRegister",
    "manufacturerLogin",
    "manufacturerRegister"
  ]);
  const allowedRoutesByRole = {
    Farmer: new Set(["dashboard", "farmerDashboard"]),
    Lab: new Set(["dashboard", "labDashboard"]),
    Manufacturer: new Set(["dashboard", "manufacturerDashboard"])
  };

  if (currentRoute === "dashboard") {
    return routeForRole(role);
  }

  if (sharedAuthenticatedRoutes.has(currentRoute)) {
    return currentRoute;
  }

  if (allowedRoutesByRole[role] && !allowedRoutesByRole[role].has(currentRoute)) {
    return routeForRole(role);
  }

  return currentRoute;
}

function summarizeItems(items) {
  const totalBatches = items.length;
  const verifiedBatches = items.filter((item) => item.qualityMetrics?.overallScore >= 85).length;
  const totalEvents = items.reduce((sum, item) => sum + (item.events?.length || 0), 0);
  const complianceRate = totalBatches
    ? Math.round((items.filter((item) => item.compliance?.ayush).length / totalBatches) * 100)
    : 0;

  return {
    overview: {
      totalBatches,
      verifiedBatches,
      totalEvents,
      complianceRate
    }
  };
}

function App() {
  const [route, setRoute] = useState("home");
  const [session, setSession] = useState({
    token: authStorage.getToken(),
    user: authStorage.getUser()
  });
  const [dashboard, setDashboard] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const activeRoute = useMemo(() => {
    if (!session.user) {
      return route;
    }
    return resolveRoute(session.user.role, route);
  }, [route, session.user]);

  useEffect(() => {
    if (!session.token) {
      return;
    }

    traceabilityApi
      .getSession()
      .then((response) => {
        setSession({
          token: authStorage.getToken(),
          user: response.user
        });
        setRoute(routeForRole(response.user.role));
      })
      .catch(() => {
        authStorage.clear();
        setSession({ token: null, user: null });
        setRoute("home");
      });
  }, []);

  useEffect(() => {
    if (!session.token) {
      return;
    }

    loadProtectedData();
  }, [session.token, session.user?.role]);

  async function loadProtectedData() {
    setLoading(true);
    try {
      let items = [];
      let dashboardResponse = null;

      if (session.user?.role === "Farmer") {
        const response = await traceabilityApi.getFarmerDashboard();
        items = response.items || [];
        dashboardResponse = summarizeItems(items);
      } else if (session.user?.role === "Lab") {
        const response = await traceabilityApi.getLabDashboard();
        items = response.items || [];
        dashboardResponse = summarizeItems(items);
      } else if (session.user?.role === "Manufacturer") {
        const response = await traceabilityApi.getManufacturerDashboard();
        items = response.items || [];
        dashboardResponse = summarizeItems(items);
      } else {
        const [dashboardData, batchesResponse] = await Promise.all([
          traceabilityApi.getDashboard(),
          traceabilityApi.getBatches()
        ]);
        dashboardResponse = dashboardData;
        items = batchesResponse.items || [];
      }

      setDashboard(dashboardResponse);
      setBatches(items);
      setSelectedBatch((current) => {
        const stillExists = current ? items.find((item) => item._id === current._id) : null;
        return stillExists || items[0] || null;
      });
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(payload) {
    try {
      const response = await traceabilityApi.login(payload);
      authStorage.save(response.token, response.user);
      setSession(response);
      setRoute(routeForRole(response.user.role));
      setError("");
    } catch (requestError) {
      if (requestError.status === 403 && payload.expectedRole) {
        setError(`Please use a ${payload.expectedRole} account for this portal. ${requestError.message}.`);
        return;
      }

      setError(requestError.message);
    }
  }

  async function handleRegister(payload) {
    try {
      const response = await traceabilityApi.register(payload);
      authStorage.save(response.token, response.user);
      setSession(response);
      setRoute(routeForRole(response.user.role));
      setError("");
    } catch (requestError) {
      if (requestError.status === 409) {
        setError("This email is already registered. Please log in instead.");
        if (payload.role === "Lab") {
          setRoute("labLogin");
        } else if (payload.role === "Manufacturer") {
          setRoute("manufacturerLogin");
        } else {
          setRoute("farmerLogin");
        }
        return;
      }

      setError(requestError.message);
    }
  }

  async function handleCreateBatch(payload) {
    try {
      await traceabilityApi.createBatch(payload);
      await loadProtectedData();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleAddBatchEvent(batchId, payload) {
    try {
      await traceabilityApi.addBatchEvent(batchId, payload);
      await loadProtectedData();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleDeleteBatch(batch) {
    const label = batch.batchNo || batch.batchCode || "this product";
    const confirmed = window.confirm(`Delete ${label}? This will remove the product from all dashboards.`);
    if (!confirmed) {
      return;
    }

    try {
      await traceabilityApi.deleteBatch(batch._id);
      if (selectedBatch?._id === batch._id) {
        setSelectedBatch(null);
      }
      await loadProtectedData();
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function handleSelectBatch(batchId) {
    try {
      const item = await traceabilityApi.getBatch(batchId);
      setSelectedBatch(item);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleLogout() {
    authStorage.clear();
    setSession({ token: null, user: null });
    setDashboard(null);
    setBatches([]);
    setSelectedBatch(null);
    setRoute("home");
  }

  const pageProps = {
    route: activeRoute,
    setRoute,
    session,
    dashboard,
    batches,
    selectedBatch,
    error,
    loading,
    onLogin: handleLogin,
    onRegister: handleRegister,
    onCreateBatch: handleCreateBatch,
    onAddBatchEvent: handleAddBatchEvent,
    onDeleteBatch: handleDeleteBatch,
    onSelectBatch: handleSelectBatch,
    reloadData: loadProtectedData
  };

  const sharedAuthenticatedRoutes = new Set([
    "home",
    "verify",
    "farmerLogin",
    "farmerRegister",
    "labLogin",
    "labRegister",
    "manufacturerLogin",
    "manufacturerRegister"
  ]);
  const PageComponent = session.user
    ? sharedAuthenticatedRoutes.has(activeRoute)
      ? publicRoutes[activeRoute] || Home
      : protectedRoutes[activeRoute] || protectedRoutes[routeForRole(session.user.role)] || Dashboard
    : publicRoutes[activeRoute] || Home;

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <Navbar
        route={activeRoute}
        session={session}
        onNavigate={setRoute}
        onLogout={handleLogout}
      />
      <PageComponent {...pageProps} />
      <Footer onNavigate={setRoute} />
    </div>
  );
}

export default App;
