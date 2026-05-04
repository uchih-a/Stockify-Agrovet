# 🌿 AgroVet Inventory System — Frontend

## Overview
Full-stack agricultural inventory management platform for Kenyan agrovet businesses.
React 18 + Vite frontend connected to an Express, MongoDB, and Gemini-powered backend.

## Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Utility styling |
| Zustand | 4 | Global state |
| React Query | 5 | Server state |
| Axios | 1.7 | HTTP client |
| GSAP | 3.12 | Homepage animations |
| Recharts | 2.12 | Data visualisation |
| React Hook Form | 7 | Forms |
| Zod | 3 | Validation |

## Prerequisites
- Node.js v20+
- `agrovet-server` running on port `5000`
- npm

## Setup — Step by Step

### 1. Clone and navigate
```bash
git clone <repo>
cd agrovet-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Set `VITE_API_BASE_URL=http://localhost:5000`.

### 4. Start development server
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@agrovet.co.ke | Admin@1234 |
| Staff | staff@agrovet.co.ke | Staff@1234 |
| Farmer | farmer1@gmail.com | Farmer@1234 |

## Application Structure
| Path | Role | Description |
|------|------|-------------|
| `/` | Public | Animated homepage |
| `/login` | Public | Login |
| `/register` | Public | Farmer registration |
| `/admin` | Admin/Staff | KPI dashboard |
| `/admin/inventory` | Admin/Staff | Product management |
| `/admin/transactions` | Admin/Staff | Transaction log |
| `/admin/users` | Admin | User management |
| `/admin/alerts` | Admin/Staff | Alert inbox |
| `/admin/reports` | Admin/Staff | Reports and AI insights |
| `/admin/suppliers` | Admin/Staff | Supplier management |
| `/farmer` | Farmer | Farmer dashboard |
| `/farmer/shop` | Farmer | Product catalogue and cart |
| `/farmer/orders` | Farmer | Order history |
| `/farmer/history` | Farmer | Full transaction history |

## How Frontend Connects to Backend

### Development proxy
`vite.config.js` proxies `/api` requests to `http://localhost:5000`.

### Auth flow
1. Login hits `POST /api/v1/auth/login`
2. Backend returns an access token and sets a refresh cookie
3. Axios automatically attaches `Authorization: Bearer <token>`
4. On `401`, the client attempts `/auth/refresh-token`
5. If refresh fails, auth state is cleared and the app redirects to `/login`

### Local fallback mode
The client includes a persistent local data fallback for routes that are still mocked on the backend. That keeps the UI usable while the remaining server controllers are being completed.

### Dark/Light theme
- Theme is stored in `localStorage`
- The app toggles the `dark` class on `<html>`
- All color tokens switch through CSS variables

## Build for Production
```bash
npm run build
npm run preview
```

## Deploy to Vercel
1. Push the client to GitHub
2. Import the project in Vercel
3. Set `VITE_API_BASE_URL=https://your-backend-url`
4. Add the deployed frontend URL to the backend `CLIENT_URL`

## `vercel.json` for SPA routing
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Blank page after deploy | Missing `VITE_API_BASE_URL` | Add the environment variable |
| CORS error | Backend `CLIENT_URL` mismatch | Update backend env |
| 401 on every request | Missing or expired refresh cookie | Clear local storage and sign in again |
| Chatbot fails | Gemini credentials or backend route issue | Check backend env and server logs |
| Images do not display | Upload route or Cloudinary config incomplete | Verify backend upload configuration |
| Empty admin data | Mocked backend routes still active | Use local fallback or finish backend controllers |
