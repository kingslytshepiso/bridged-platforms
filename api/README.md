# Static Web App API

Minimal Azure Functions (Node.js v4) deployed with this Static Web App. It provides a small **managed API** surface (e.g. for health checks) while the **contact form** continues to use the external Azure Function from `VITE_API_URL` (see `docs/API_INTEGRATION.md`).

- **`GET /api/health`** – Returns a JSON payload. Use for probes or local verification with `swa start`.

## Local development

From the repo root, run the SWA CLI to serve the app and API together:

```bash
npm run build
npx swa start dist --api-location api
```

## Deployment

The GitHub Actions workflow sets `api_location: "api"`. The deploy step builds and deploys this folder as the SWA’s managed API.
