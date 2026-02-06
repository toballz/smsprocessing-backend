# SMS Processing Backend (smsserver)

Backend service that supports an Android SMS bridge. The Android client polls this server every 5 seconds to fetch outbound SMS work and to report delivery/status updates. This avoids sockets and keeps the workflow simple and reliable.

## What it does
- Provides HTTP endpoints for login and core SMS workflows.
- Accepts outbound SMS requests queued on the server.
- Returns pending SMS jobs to the Android device on a 5‑second polling interval.
- Receives status updates from the device after messages are sent.

## Tech stack
- Node.js + Express
- PostgreSQL (`pg`)

## Project structure
- `startserver.js` – Express app entrypoint
- `routers/` – API route handlers
- `sql_table/` – SQL schema files

## Getting started
```bash
npm install
npm run start
```

The server listens on `PORT` (defaults to `4000`).

## Health check
`GET /health`

## API base paths
- `POST /api/login/*`
- `POST /api/core/v1/*`

## Notes
This backend is designed to be paired with the Android client that performs the 5‑second polling to pull pending SMS work from the server, instead of using sockets.
