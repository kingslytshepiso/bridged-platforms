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

## Configuration we added (and relation to InternalServerError)

Summary of what was added in this repo and how it might relate to the “content server has rejected the request with: InternalServerError” and the `swa-db-connections` log line.

| What we added | Where | Could it cause the error? |
|---------------|--------|----------------------------|
| **api_location: "api"** | Workflow | We point to the `api` folder (Node.js Azure Functions for the health endpoint). The error log shows Azure validating `/github/workspace/swa-db-connections`. That path is for **Data API / Database connections**, which is a different feature. We do **not** use or set Data API. So our `api_location` is for the **Functions API** only. The backend may still run a `swa-db-connections` check when the **Static Web App resource in Azure** has “Database connections” or “Data API” enabled in the portal. |
| **api/** folder | Repo (Node.js health function) | Same as above: this is the Functions API, not the Data API. No `staticwebapp.database.config.json` or `swa-db-connections` folder was added. |
| **staticwebapp.config.json** | `public/` (copied to `dist/`) | Contains routes, navigationFallback, globalHeaders, responseOverrides, and **platform.apiRuntime: "node:20"**. None of these refer to database or Data API. Unlikely to be the cause. |
| **staticwebapp.config.json** (404 → index.html) | Same file | SPA fallback only. Not related to Data API or backend validation. |

**Conclusion:** The failure is **not** caused by Database connections (the resource can have `databaseConnections: []` and the backend may still log `swa-db-connections`).

**You can’t edit build settings in the Azure Portal**

For GitHub-connected Static Web Apps, **build settings are not editable in the portal** after creation. The “Configuration” blade may only show options like Password protection and Preview environments; there is no UI for App location, Api location, or App artifact location. Those values are **taken from the workflow file** on each deployment. So the source of truth is [`.github/workflows/azure-static-web-apps.yml`](../.github/workflows/azure-static-web-apps.yml), which already has:

- `app_location: "/"`
- `api_location: "api"`
- `output_location: "dist"`

Azure uses these workflow values when the action runs. If the portal (or an API response) shows different values (e.g. Api location empty, App artifact `build`), that’s often leftover from creation and doesn’t override the workflow. So no change is needed in the repo for build paths.

If InternalServerError continues, try: **reset the deployment token** (Manage deployment token → Reset, then update the GitHub secret), **create a new Static Web App** and use its token, or **report the issue** to [Azure/static-web-apps](https://github.com/Azure/static-web-apps/issues) with the DeploymentId and run URL.

## Troubleshooting

### "deployment_token was not provided"

The deploy step requires the deployment token. Add it as a repository secret:

1. In **Azure Portal**, open your Static Web App → **Overview** → **Manage deployment token** → copy the token.
2. In **GitHub**, go to the repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`, Value: the token you copied.
4. Re-run the failed workflow (or push a new commit).

### InternalServerError / "content server has rejected the request" / "swa-db-connections"

If the deploy step fails with an internal error or a message about the deployment token:

1. **Check the "Log deploy failure context" step** – On failure, this step outputs `outcome`, `conclusion`, `static_web_app_url`, `run_id`, and `run_url` so you can understand what failed. Ensure `AZURE_STATIC_WEB_APPS_API_TOKEN` is set in GitHub Secrets. In the run log, check:
   - **Workflow file** – Should show `azure-static-web-apps.yml`. If Azure Portal still shows an old workflow name (e.g. `azure-static-web-apps-gentle-beach-00be72703.yml`), the run might be coming from that file if it still exists in the repo. This repo uses only `.github/workflows/azure-static-web-apps.yml`.
   - **AZURE_STATIC_WEB_APPS_API_TOKEN** – Should say "set (non-empty)". If it says "MISSING or empty", add or update the secret as above.
   - **Workspace layout** – Confirms `app_location: "/"` and `api_location: "api"` exist. The path `swa-db-connections` is sometimes checked by Azure’s backend; it’s not required in this repo and can be ignored if the rest of the layout is correct.

2. **Reset the deployment token** – In Azure Portal → Static Web App → **Overview** → **Manage deployment token** → **Reset token**. Copy the new token and update the `AZURE_STATIC_WEB_APPS_API_TOKEN` secret in GitHub, then re-run the workflow.

3. **Azure still using an old workflow file** – GitHub runs whatever workflow files exist in the repo on push/PR. If you renamed or replaced the workflow (e.g. to `azure-static-web-apps.yml`), ensure the old file is deleted and that only the new workflow triggers on `main`. In Azure Portal, under the Static Web App’s deployment/build settings, if there is a field for “Workflow file” or “GitHub workflow”, set it to the filename you use (e.g. `azure-static-web-apps.yml`) if the portal allows editing; otherwise the link is by repo + branch, and the workflow that runs is the one in the repo.

### Debugging shows workflow OK, layout OK, token set – but still InternalServerError

If “Log deploy failure context” AZURE_STATIC_WEB_APPS_API_TOKEN secret is set and the failure is happening **on Azure’s side** after the action uploads (e.g. “The content server has rejected the request with: InternalServerError”). The `swa-db-connections` path in the log is checked by Azure’s backend; this repo does not use it and that is expected.

Try in this order:

1. **Reset the deployment token and update the secret**  
   Azure Portal → your Static Web App → **Overview** → **Manage deployment token** → **Reset token**. Copy the new token, update the `AZURE_STATIC_WEB_APPS_API_TOKEN` repository secret in GitHub, then re-run the workflow. A stale or mismatched token can cause backend errors even when the secret is “set”.

2. **Confirm the token is for this Static Web App**  
   If you have multiple SWAs or recreated the app, ensure the secret’s value is the token from the **same** SWA you want to deploy to (the one whose URL you expect the site on).

3. **Check SWA configuration in Azure**  
   In the Static Web App resource, review **Configuration** / **Settings** and any “Database” or “Connections” options. If the app was set up with features that expect a different repo layout (e.g. database connections), try disabling or reconfiguring them if you don’t need them, then redeploy.

4. **Create a new Static Web App (if the error persists)**  
   Sometimes the existing SWA gets into a bad state. Create a **new** Static Web App in the same resource group (or subscription), connect it to this GitHub repo and `main` branch, then copy the new app’s deployment token and set it as `AZURE_STATIC_WEB_APPS_API_TOKEN`. Delete or leave the old SWA as needed.

5. **Report to Azure**  
   Check [Azure Status](https://status.azure.com/) for Static Web Apps. If the problem continues after the steps above, open an issue at [Azure/static-web-apps](https://github.com/Azure/static-web-apps/issues) and include: the **DeploymentId** from the error (e.g. `e4ca23f4-6f7a-451e-81b2-43722e71258a`), the **run URL** from the “Log deploy failure context” step, and the full error message (“The content server has rejected the request with: InternalServerError”).

## Build configuration (in the workflow)

| Setting | Value | Meaning |
|--------|--------|---------|
| `app_location` | `"/"` | Repo root is the app source. |
| `api_location` | `"api"` | Node.js API lives in the `api` folder (enables App Insights). |
| `output_location` | `"dist"` | Vite build output directory. |

## Related docs

- [API Integration](API_INTEGRATION.md) – Contact form and Azure Function.
- [Quick Start](QUICK_START.md) – Local development.
