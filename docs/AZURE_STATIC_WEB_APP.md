# Azure Static Web App – Build and Deployment

This doc lists the GitHub Actions workflow and the environment variables / secrets used when building and deploying the site to Azure Static Web Apps. Use it when setting up a new repo or **recreating the Azure Static Web App**.

## Workflow file

- **File:** [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml)
- **Triggers:** Push and pull requests targeting the `main` branch.

---

## Required GitHub repository secrets

Configure these under **Settings → Secrets and variables → Actions** (repository secrets).

| Secret name | Required | Description | Where to get it |
|-------------|----------|-------------|-----------------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | **Yes** (for deployment) | Deployment token for the Static Web App. The deploy action requires it; without it you get "deployment_token was not provided". | Azure Portal → your Static Web App → **Overview** → **Manage deployment token** → copy. |
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
2. Copy the **deployment token** from **Overview → Manage deployment token** and in GitHub **Settings → Secrets and variables → Actions** add or update `AZURE_STATIC_WEB_APPS_API_TOKEN` with that value.
3. Keep `VITE_API_URL`, `VITE_FUNCTION_KEY`, and `VITE_APPINSIGHTS_KEY` as needed for the new environment.

## Troubleshooting

### "deployment_token was not provided"

The deploy step requires the deployment token. Add it as a repository secret:

1. In **Azure Portal**, open your Static Web App → **Overview** → **Manage deployment token** → copy the token.
2. In **GitHub**, go to the repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`, Value: the token you copied.
4. Re-run the failed workflow (or push a new commit).

To allow the workflow to succeed **without** deploying when the token is missing (e.g. CI-only), you can set `SKIP_DEPLOY_ON_MISSING_SECRETS: true` in the `env` of the "Build And Deploy" step in the workflow. Deployment will be skipped until the secret is set.

## Build configuration (in the workflow)

| Setting | Value | Meaning |
|--------|--------|---------|
| `app_location` | `"/"` | Repo root is the app source. |
| `api_location` | `"api"` | Node.js API lives in the `api` folder (enables App Insights). |
| `output_location` | `"dist"` | Vite build output directory. |

## Related docs

- [API Integration](API_INTEGRATION.md) – Contact form and Azure Function.
- [Quick Start](QUICK_START.md) – Local development.
