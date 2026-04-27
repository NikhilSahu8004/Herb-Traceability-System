export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

function getToken() {
  return window.localStorage.getItem("traceability-token");
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    const networkError = new Error(
      `Cannot connect to the backend server. Please make sure the API is running on ${API_BASE_URL}.`
    );
    networkError.status = 0;
    throw networkError;
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || "Request failed");
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export const traceabilityApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getSession: () => request("/auth/me"),
  getDashboard: () => request("/dashboard"),
  getBatches: () => request("/batches"),
  getFarmerDashboard: () => request("/farmer/dashboard"),
  getLabDashboard: () => request("/lab/dashboard"),
  getManufacturerDashboard: () => request("/manufacturer/dashboard"),
  getBatch: (batchId) => request(`/batches/${batchId}`),
  createBatch: (payload) =>
    request("/batches", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteBatch: (batchId) =>
    request(`/batches/${batchId}`, {
      method: "DELETE"
    }),
  addBatchEvent: (batchId, payload) =>
    request(`/batches/${batchId}/events`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  verifyTrace: (batchCode) => request(`/trace/${batchCode}`)
};

export const authStorage = {
  save(token, user) {
    window.localStorage.setItem("traceability-token", token);
    window.localStorage.setItem("traceability-user", JSON.stringify(user));
  },
  getToken() {
    return window.localStorage.getItem("traceability-token");
  },
  getUser() {
    const raw = window.localStorage.getItem("traceability-user");
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    window.localStorage.removeItem("traceability-token");
    window.localStorage.removeItem("traceability-user");
  }
};
