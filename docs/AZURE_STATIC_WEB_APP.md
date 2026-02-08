# Azure Static Web App – Build and Deployment

This doc lists the GitHub Actions workflow and the environment variables / secrets used when building and deploying the site to Azure Static Web Apps. Use it when setting up a new repo or **recreating the Azure Static Web App**.

## Workflow file

- **File:** [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml)
- **Triggers:** Push and pull requests targeting the `main` branch.

The workflow supports **both** deployment authorization methods (chosen when you create the Static Web App in Azure).

---

## Deployment authorization: GitHub vs Deployment token

When you create the Azure Static Web App, you choose how deployment is authorized:

| Option | What it means | What you need in GitHub |
|--------|----------------|--------------------------|
| **GitHub** | Azure trusts your repo via OpenID Connect (OIDC). No long‑lived deployment token. | **No** `AZURE_STATIC_WEB_APPS_API_TOKEN` secret. The workflow requests an OIDC token and passes `github_id_token` to the deploy action. |
| **Deployment token** | Azure gives you a static token; the workflow sends it to authorize the deploy. | **Yes.** Add a repo secret `AZURE_STATIC_WEB_APPS_API_TOKEN` and set it to the value from Azure (**Manage deployment token**). |

The same workflow file is used for both: it always sends `github_id_token` (for GitHub auth) and, if present, `AZURE_STATIC_WEB_APPS_API_TOKEN` (for token auth). If you used **GitHub** when creating the SWA, you do **not** need to create or store the deployment token secret.

---

## Required GitHub repository secrets

Configure these under **Settings → Secrets and variables → Actions** (repository secrets).

| Secret name | Required when | Description | Where to get it |
|-------------|----------------|-------------|-----------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | Only if you chose **Deployment token** | Deployment token for the Static Web App | Azure Portal → your Static Web App → **Manage deployment token** → copy. Not needed if you chose **GitHub** authorization. |
| `VITE_API_URL` | Yes (for contact form) | Contact form API base URL | Your Azure Function URL, e.g. `https://<function-app-name>.azurewebsites.net/api/ContactForm`. |
| `VITE_FUNCTION_KEY` | Yes (production) | Function key for the ContactForm API | Azure Portal → Function App → **Functions** → **ContactForm** → **Function keys** → copy default key. |
| `VITE_APPINSIGHTS_KEY` | Optional | Application Insights key or connection string | Azure Portal → Application Insights resource → **Overview** (instrumentation key) or **Connection string**. |

## Build-time environment variables

These are passed to the workflow from the secrets above and used during `vite build`:

| Variable | Passed from secret | Purpose |
|----------|--------------------|---------|
| `NODE_VERSION` | Fixed in workflow (`"20"`) | Node version for build and API. |
| `VITE_API_URL` | `secrets.VITE_API_URL` | Injected into the front end so the contact form calls the correct API. |
| `VITE_FUNCTION_KEY` | `secrets.VITE_FUNCTION_KEY` | Injected so the front end can authenticate to the ContactForm function. |
| `VITE_APPINSIGHTS_KEY` | `secrets.VITE_APPINSIGHTS_KEY` | Injected for Application Insights in the browser. |

## If you recreate the Azure Static Web App

1. In Azure, create a new Static Web App and connect it to this GitHub repo.
2. Choose **Deployment authorization**:
   - **GitHub** – No token secret needed. Ensure the workflow file is [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml) (it already sends `github_id_token`).
   - **Deployment token** – Copy the token from **Manage deployment token** and in GitHub **Settings → Secrets and variables → Actions** set or update `AZURE_STATIC_WEB_APPS_API_TOKEN` to that value.
3. Keep `VITE_API_URL`, `VITE_FUNCTION_KEY`, and `VITE_APPINSIGHTS_KEY` as needed for the new environment.
4. No workflow changes are required when recreating the app—only update the token secret if you use **Deployment token**.

## Build configuration (in the workflow)

| Setting | Value | Meaning |
|--------|--------|---------|
| `app_location` | `"/"` | Repo root is the app source. |
| `api_location` | `"api"` | Node.js API lives in the `api` folder (enables App Insights). |
| `output_location` | `"dist"` | Vite build output directory. |

## Related docs

- [API Integration](API_INTEGRATION.md) – Contact form and Azure Function.
- [Quick Start](QUICK_START.md) – Local development.
