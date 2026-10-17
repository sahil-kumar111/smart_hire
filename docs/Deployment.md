# SmartHire AI — Deployment

## Overview

SmartHire AI uses a **hybrid deployment architecture**.

The frontend is deployed publicly on **Vercel**, while the backend API and PostgreSQL database run locally on the developer's machine. **ngrok** provides secure public HTTPS access to the local FastAPI backend.

| Component             | Hosting                               |
| --------------------- | ------------------------------------- |
| Frontend              | **Vercel**                            |
| Backend API           | **Local machine — FastAPI + Uvicorn** |
| Database              | **Local PostgreSQL**                  |
| Public backend access | **ngrok HTTPS tunnel**                |

### Architecture

```text
User Browser
     │
     │ HTTPS
     ▼
┌─────────────────────┐
│  Vercel             │
│  React + TypeScript │
└──────────┬──────────┘
           │
           │ VITE_API_URL
           ▼
┌─────────────────────┐
│  ngrok HTTPS Tunnel │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  FastAPI + Uvicorn  │
│  Local PC :8000     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  PostgreSQL         │
│  Local Database     │
└─────────────────────┘
```

### Important Deployment Limitation

The frontend is publicly accessible through Vercel, but backend functionality is available only while the following services are running on the developer's machine:

* PostgreSQL
* FastAPI / Uvicorn
* ngrok

If the developer's computer is shut down or any of these services stops, the Vercel frontend will remain accessible but API-dependent functionality will not work.

This deployment model is suitable for **development, demonstrations, testing, and project presentations**. For a fully production-ready system, the backend and database should eventually be moved to cloud infrastructure.

---

## Prerequisites

Before deployment, install and configure:

* Node.js and npm
* Python 3.10+
* Python virtual environment
* PostgreSQL
* Git
* GitHub repository
* Vercel account
* ngrok account and CLI
* Required API keys

The following must be available locally:

```text
D:\SmartHire-AI
├── backend
├── frontend
└── docs
```

---

# 1. Backend Deployment

## Backend Environment Variables

Create:

```text
D:\SmartHire-AI\backend\.env
```

Example:

```env
APP_NAME=SmartHire AI
APP_VERSION=1.0.0
DEBUG=True

HOST=0.0.0.0
PORT=8000

SECRET_KEY=your-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smarthire_ai

FRONTEND_URL=https://YOUR-APP.vercel.app

GROQ_API_KEY=gsk_your_groq_key
```

### Environment Variable Notes

* Replace all placeholder values with real values.
* `HOST=0.0.0.0` allows ngrok to access the FastAPI server.
* `FRONTEND_URL` must contain the exact Vercel frontend URL.
* Never commit `.env` to GitHub.
* Commit `.env.example` with placeholder values instead.
* Never expose `SECRET_KEY`, database passwords, or API keys publicly.

---

## PostgreSQL Database

Make sure PostgreSQL is running and the database exists.

Expected database:

```text
Database: smarthire_ai
Host: localhost
Port: 5432
User: postgres
```

Verify that the `DATABASE_URL` in `.env` matches your local PostgreSQL configuration.

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smarthire_ai
```

Do not expose PostgreSQL directly to the internet.

---

## Backend CORS Configuration

The FastAPI application should allow the frontend origins that actually need access.

Example:

```python
allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://YOUR-APP.vercel.app",
]
```

Replace:

```text
https://YOUR-APP.vercel.app
```

with the actual Vercel deployment URL.

### Temporary Development Configuration

For initial debugging only, you may temporarily use:

```python
allow_origins=["*"]
```

Do **not** keep this configuration for a production deployment.

After testing, use explicit origins.

---

## Start FastAPI

Open PowerShell:

```powershell
cd D:\SmartHire-AI\backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API should now be available locally at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

If `/docs` loads successfully, the backend is running.

Keep this terminal open.

---

# 2. ngrok Configuration

ngrok creates a public HTTPS tunnel from the internet to the local FastAPI server.

## Install and Authenticate ngrok

Create an ngrok account and install the Windows CLI.

Authenticate:

```powershell
ngrok config add-authtoken YOUR_TOKEN
```

Replace:

```text
YOUR_TOKEN
```

with the token provided by ngrok.

Never commit or publicly share the ngrok authentication token.

---

## Start ngrok

With FastAPI already running, open another PowerShell terminal:

```powershell
ngrok http 8000
```

Example:

```text
Forwarding    https://xxxx.ngrok-free.dev -> http://localhost:8000
```

The HTTPS URL is the public address of your local backend.

---

## Verify ngrok

Open:

```text
https://xxxx.ngrok-free.dev/docs
```

You should see the FastAPI Swagger documentation.

If the local `/docs` works but the ngrok `/docs` does not, check that:

1. Uvicorn is still running.
2. ngrok is running.
3. Port `8000` is correct.
4. The ngrok URL is copied correctly.

---

## Important ngrok Limitation

With a typical free ngrok setup, the public URL may change when the tunnel is restarted.

For example:

```text
Old:
https://abc123.ngrok-free.dev

New:
https://xyz789.ngrok-free.dev
```

When this happens, the Vercel frontend must be updated with the new API URL and redeployed.

---

# 3. Frontend Deployment on Vercel

## Vercel Project Settings

Configure the Vercel project approximately as follows:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework        | Vite            |
| Root Directory   | `frontend`      |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |

Vercel should be connected to the project's GitHub repository.

---

## Frontend Environment Variable

In Vercel:

```text
Project
→ Settings
→ Environment Variables
```

Add:

```text
Name:
VITE_API_URL
```

Value:

```text
https://YOUR-NGROK-URL.ngrok-free.dev/api/v1
```

For example:

```text
https://xxxx.ngrok-free.dev/api/v1
```

### Important

If the backend routes are mounted under `/api/v1`, the environment variable must include:

```text
/api/v1
```

Vite embeds `VITE_API_URL` during the frontend build.

Therefore, after changing it, **redeploy the frontend**.

---

## Vercel Environment Scope

Make sure `VITE_API_URL` is enabled for the environment being deployed.

For example:

```text
Production
Preview
```

Enable only the environments required by the project.

---

# 4. Frontend Local Development

For local development, create:

```text
D:\SmartHire-AI\frontend\.env.local
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Then:

```powershell
cd D:\SmartHire-AI\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

For pure local development:

```text
Frontend → Local FastAPI → Local PostgreSQL
```

ngrok is not required.

---

# 5. Production Build Test

Before pushing frontend changes to GitHub, test the production build:

```powershell
cd D:\SmartHire-AI\frontend
npm run build
```

If the build fails, fix all TypeScript and build errors before deployment.

---

# 6. Complete Live Deployment Flow

The complete live setup is:

```text
                    INTERNET
                        │
                        ▼
              ┌─────────────────┐
              │ Vercel Frontend │
              └────────┬────────┘
                       │
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │      ngrok      │
              │  Public Tunnel  │
              └────────┬────────┘
                       │
                       │
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │  Uvicorn :8000  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │     Local       │
              └─────────────────┘
```

The browser never connects directly to PostgreSQL.

---

# 7. Daily Startup Procedure

Use the following sequence whenever you want to make the live application available.

## Step 1 — Start PostgreSQL

Make sure the PostgreSQL service is running.

Confirm that the `smarthire_ai` database exists.

---

## Step 2 — Start FastAPI

```powershell
cd D:\SmartHire-AI\backend
.\venv\Scripts\activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Verify:

```text
http://127.0.0.1:8000/docs
```

---

## Step 3 — Start ngrok

Open another terminal:

```powershell
ngrok http 8000
```

Copy the HTTPS forwarding URL.

Example:

```text
https://xxxx.ngrok-free.dev
```

---

## Step 4 — Verify the Public API

Open:

```text
https://xxxx.ngrok-free.dev/docs
```

Confirm that the FastAPI documentation loads.

---

## Step 5 — Check Vercel API URL

The Vercel environment variable should be:

```text
VITE_API_URL=https://xxxx.ngrok-free.dev/api/v1
```

If the ngrok URL changed, update this variable.

---

## Step 6 — Redeploy Vercel

After changing `VITE_API_URL`:

```text
Vercel
→ Deployments
→ Redeploy
```

The frontend must be rebuilt because Vite environment variables are embedded during build time.

---

## Step 7 — Test SmartHire AI

Open the Vercel application and test:

* Frontend loading
* Registration
* Login
* Authentication
* API requests
* AI functionality
* Database operations
* Camera/microphone functionality, if implemented

---

# 8. Shutdown Procedure

When finished using the live deployment:

### Stop ngrok

In the ngrok terminal:

```text
Ctrl + C
```

### Stop FastAPI

In the Uvicorn terminal:

```text
Ctrl + C
```

### PostgreSQL

PostgreSQL can remain running or be stopped depending on your development requirements.

---

# 9. Security Checklist

Before sharing the application:

* [ ] Never commit `.env` files.
* [ ] Never commit API keys.
* [ ] Never commit database passwords.
* [ ] Never commit JWT secrets.
* [ ] Never commit ngrok authentication tokens.
* [ ] Use explicit CORS origins.
* [ ] Do not use `allow_origins=["*"]` in the final configuration.
* [ ] Keep PostgreSQL accessible only locally.
* [ ] Use HTTPS for the Vercel frontend.
* [ ] Use HTTPS for public API access through ngrok.
* [ ] Use strong random values for `SECRET_KEY`.
* [ ] Rotate credentials if they were accidentally exposed.
* [ ] Make sure `.gitignore` excludes environment files and generated directories.

Recommended `.gitignore` entries include:

```text
.env
.env.*
venv/
__pycache__/
node_modules/
dist/
uploads/
*.pyc
```

---

# 10. Troubleshooting

| Problem                               | Likely Cause                                  | Solution                                               |
| ------------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| Frontend loads but API fails          | FastAPI or ngrok is not running               | Start FastAPI and ngrok                                |
| Local `/docs` does not load           | FastAPI is not running correctly              | Check Uvicorn terminal and restart the API             |
| ngrok `/docs` does not load           | Tunnel or backend problem                     | Verify local `/docs`, then restart ngrok               |
| Vercel calls `127.0.0.1`              | Incorrect `VITE_API_URL`                      | Set the Vercel environment variable and redeploy       |
| CORS error                            | Vercel origin is not allowed                  | Add the exact Vercel URL to FastAPI CORS               |
| API returns 404                       | Incorrect API prefix                          | Check whether `/api/v1` is required                    |
| Login works locally but not on Vercel | Frontend contains hardcoded localhost URL     | Search for `localhost:8000` and `127.0.0.1:8000`       |
| ngrok URL changed                     | Tunnel restarted                              | Update `VITE_API_URL` and redeploy                     |
| Database connection fails             | PostgreSQL/database credentials are incorrect | Check PostgreSQL and `DATABASE_URL`                    |
| AI requests fail                      | Groq API key is missing/invalid               | Check `GROQ_API_KEY` and restart FastAPI               |
| Camera/microphone is blocked          | Browser permissions/security restrictions     | Use the HTTPS Vercel URL and grant browser permissions |
| Vercel build fails                    | Frontend build or TypeScript error            | Run `npm run build` locally and fix errors             |

---

# 11. Common Configuration Mistakes

### Mistake 1 — Using localhost in Vercel

Do not use:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

for the Vercel deployment.

Use the public ngrok URL:

```env
VITE_API_URL=https://YOUR-NGROK-URL.ngrok-free.dev/api/v1
```

---

### Mistake 2 — Forgetting to Redeploy

Changing:

```text
VITE_API_URL
```

in Vercel does not automatically change an already-built frontend.

Redeploy after changing the variable.

---

### Mistake 3 — Wrong API Prefix

If FastAPI exposes routes under:

```text
/api/v1
```

the frontend should use:

```text
https://YOUR-NGROK-URL.ngrok-free.dev/api/v1
```

not:

```text
https://YOUR-NGROK-URL.ngrok-free.dev
```

---

### Mistake 4 — Backend Only Listening on Localhost

Do not start the backend only with:

```powershell
uvicorn app.main:app --port 8000
```

Use:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

This allows ngrok to forward requests to the backend.

---

# 12. Future Production Deployment

The current hybrid architecture is suitable for:

* Development
* Testing
* Demonstrations
* College/project presentations
* Controlled live testing

For a fully production-ready application, move the backend and database to cloud infrastructure.

Possible options include:

* Railway
* Render
* Fly.io
* AWS
* Azure

The production architecture would become:

```text
User Browser
      │
      ▼
Vercel
      │
      ▼
Cloud FastAPI Backend
      │
      ├──────────────► Groq / AI Services
      │
      ▼
Managed PostgreSQL
```

### Benefits

* Backend remains online without the developer PC.
* Database remains continuously available.
* ngrok is no longer required.
* API gets a stable production URL.
* Better reliability and scalability.
* Easier monitoring and deployment automation.
* Better separation between development and production infrastructure.

The frontend environment variable would then change from:

```text
VITE_API_URL=https://xxxx.ngrok-free.dev/api/v1
```

to something similar to:

```text
VITE_API_URL=https://api.your-domain.com/api/v1
```

---

# 13. Related Documentation

The following project documentation should be maintained alongside this file:

* `ProjectScope.md` — project scope and status
* `FunctionalRequirements.md` — functional requirements
* `NonFunctionalRequirements.md` — quality attributes and availability
* `DatabaseDesign.md` — database design
* `ERDiagram.md` — entity relationship diagram
* `UIWireframes.md` — user interface wireframes and screen designs
* `UserWorkflows.md` — user and operator workflows

---

# 14. Deployment Summary

### Local Development

```text
React/Vite
    │
    ▼
FastAPI
    │
    ▼
PostgreSQL
```

No ngrok required.

### Current Live Deployment

```text
Vercel
    │
    ▼
ngrok
    │
    ▼
Local FastAPI
    │
    ▼
Local PostgreSQL
```

PostgreSQL, FastAPI, and ngrok must remain running.

### Future Production Deployment

```text
Vercel
    │
    ▼
Cloud FastAPI
    │
    ▼
Managed PostgreSQL
```

No local backend or ngrok dependency.

---

## Deployment Status

**Current Deployment Model:** Hybrid

**Frontend:** Vercel

**Backend:** Local FastAPI

**Database:** Local PostgreSQL

**Public API Tunnel:** ngrok

**Production Cloud Backend:** Planned future improvement