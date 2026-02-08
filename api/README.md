# Static Web App API

Minimal Azure Functions (Node.js v4) used by this Static Web App so that **Application Insights is enabled**. Azure requires at least one function in the app to apply App Insights and remove the warning:

> App Insights is only applicable to Static Web Apps with at least one function. Add a function to your app to enable App Insights.

- **`GET /api/health`** – Returns `{ ok: true }`. Use for health checks or to satisfy the “one function” requirement.
- **Contact form** – Still handled by the external Azure Function (see `VITE_API_URL` / `docs/API_INTEGRATION.md`). This API does not replace it.

## Local development

From the repo root, run the SWA CLI to serve the app and API together:

```bash
npm run build
npx swa start dist --api-location api
```

## Deployment

The GitHub Actions workflow sets `api_location: "api"`. The deploy step builds and deploys this folder as the SWA’s managed API.
