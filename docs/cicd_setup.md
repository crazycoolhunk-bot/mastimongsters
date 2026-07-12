# Masti Mongsters CI/CD Pipeline Setup Guide (Workload Identity Federation)

Since your Google Cloud organization disables static JSON key file creation, we have configured **Workload Identity Federation (WIF)**. 

Every time code is pushed to your `main` branch:
1. GitHub Actions will request a temporary, secure OIDC token from Google Cloud.
2. The workflow will compile your React client with your production Firebase keys.
3. It will build and push the unified Docker container and update the service on Cloud Run.

---

## 💾 GitHub Repository Secrets Configuration
Go to your GitHub repository (**crazycoolhunk-bot/mastimongsters**):
1. Click the **Settings** tab.
2. Under the left menu, expand **Secrets and variables** and click **Actions**.
3. Click **New repository secret** to add the following secrets:

| Secret Name | Value |
| :--- | :--- |
| `GCP_PROJECT_ID` | `jaisheelmastiproject` |
| `GCP_SERVICE_ACCOUNT` | `github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/493144094484/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `VITE_FIREBASE_API_KEY` | `AIzaSyDng79pce04Q9FrA_xQ-9Ncxxb92aCJZOQ` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `jaisheelmastiproject.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `jaisheelmastiproject` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `jaisheelmastiproject.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `493144094484` |
| `VITE_FIREBASE_APP_ID` | `1:493144094484:web:d0bab7fa2f79e0fc13b401` |

---

## 🚀 Triggering your first CI/CD Build
Once all the secrets are saved in GitHub, commit and push your changes to trigger the deploy:

```bash
git add .
git commit -m "Configure keyless CI/CD with Workload Identity Federation"
git push origin main
```

Navigate to the **Actions** tab on your GitHub repository page to watch the automated deployment process execute!
