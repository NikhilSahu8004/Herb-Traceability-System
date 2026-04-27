# Herb Traceability System

A React + Node.js major-project codebase for a blockchain-based botanical traceability system for Ayurvedic herbs using geo-tagging. The repository is now organized around the architecture you shared, while keeping MongoDB as the main application database.

## Architecture

```text
frontend/
  public/
  src/
    components/
    pages/
      Farmer/
      Lab/
      Manufacturer/
      Verify/
    services/
    App.js
    index.js

backend/
  config/
  controllers/
  routes/
  models/
  services/
  app.js

blockchain/
python-services/
database/
docker/
```

## Frontend

- React + Vite
- Role-based pages for Farmer, Lab, Manufacturer, and Verify flows
- Reusable components like `Navbar`, `QRScanner`, `MapView`, and `BatchCard`
- API and blockchain helper modules in `frontend/src/services`

## Backend

- Express + MongoDB + Mongoose
- Separate controllers and routes for farmer, lab, manufacturer, and batch operations
- JWT authentication with role-aware login
- QR generation and geo-validation service modules

## Current flows

- Farmer registration and login
- Lab login
- Manufacturer login
- Farmer batch creation with geo-tagged coordinates
- Lab report submission
- Manufacturer processing updates
- Public batch verification by batch code
- QR image generation for each batch

## Default logins

- Farmer: `farmer@example.com` / `password123`
- Lab: `lab@example.com` / `password123`
- Manufacturer: `manufacturer@example.com` / `password123`

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Make sure `.env` contains:

```env
PORT=5001
CLIENT_URL=http://localhost:5173
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret
```

3. Start the frontend and backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5001`

## Notes

- `database/schema.sql` is included as a reference artifact for documentation, but the working app uses MongoDB.
- `blockchain/` contains a starter Hardhat contract scaffold for future smart-contract integration.
- `python-services/` contains starter geo-tagging and analytics microservice stubs.
- `docker/` contains a basic containerization starter for the full stack.
# Herb-Traceability-System
