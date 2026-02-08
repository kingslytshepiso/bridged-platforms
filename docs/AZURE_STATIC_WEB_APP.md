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

### InternalServerError / "content server has rejected the request" / "swa-db-connections"

If the deploy step fails with an internal error or a message about the deployment token:

1. **Use the debugging step** – The workflow includes a "Deployment debugging (pre-deploy)" step. In the run log, check:
   - **Workflow file** – Should show `azure-static-web-apps.yml`. If Azure Portal still shows an old workflow name (e.g. `azure-static-web-apps-gentle-beach-00be72703.yml`), the run might be coming from that file if it still exists in the repo. This repo uses only `.github/workflows/azure-static-web-apps.yml`.
   - **AZURE_STATIC_WEB_APPS_API_TOKEN** – Should say "set (non-empty)". If it says "MISSING or empty", add or update the secret as above.
   - **Workspace layout** – Confirms `app_location: "/"` and `api_location: "api"` exist. The path `swa-db-connections` is sometimes checked by Azure’s backend; it’s not required in this repo and can be ignored if the rest of the layout is correct.

2. **Reset the deployment token** – In Azure Portal → Static Web App → **Overview** → **Manage deployment token** → **Reset token**. Copy the new token and update the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub, then re-run the workflow.

3. **Azure still using an old workflow file** – GitHub runs whatever workflow files exist in the repo on push/PR. If you renamed or replaced the workflow (e.g. to `azure-static-web-apps.yml`), ensure the old file is deleted and that only the new workflow triggers on `main`. In Azure Portal, under the Static Web App’s deployment/build settings, if there is a field for “Workflow file” or “GitHub workflow”, set it to the filename you use (e.g. `azure-static-web-apps.yml`) if the portal allows editing; otherwise the link is by repo + branch, and the workflow that runs is the one in the repo.

## Build configuration (in the workflow)

| Setting | Value | Meaning |
|--------|--------|---------|
| `app_location` | `"/"` | Repo root is the app source. |
| `api_location` | `"api"` | Node.js API lives in the `api` folder (enables App Insights). |
| `output_location` | `"dist"` | Vite build output directory. |

## Related docs

- [API Integration](API_INTEGRATION.md) – Contact form and Azure Function.
- [Quick Start](QUICK_START.md) – Local development.
