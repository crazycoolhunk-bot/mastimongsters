# Masti Mongsters - Step-by-Step Setup & Deployment Playbook

This document is a complete reference playbook detailing the exact steps taken to build, secure, and deploy the React + Express + Firestore architecture on Google Cloud keylessly.

---

## 🛠️ Step 1: Local Project Structure & Dependencies

1.  **Initialize Folders**:
    Create `/client` (Vite + React) and `/server` (Node.js + Express) subdirectories.
2.  **Client Dependencies**:
    Install tailwindcss, Lucide React icons, and `react-window` (for virtualized member lists):
    ```bash
    npm install react-window lucide-react firebase
    ```
3.  **Server Dependencies**:
    Install Express, CORS, Multer (for memory buffer file uploads), and the Firebase Admin SDK:
    ```bash
    npm install express cors multer firebase-admin dotenv
    ```

---

## 💾 Step 2: Database (Firestore) & Storage (GCS) Setup

1.  **GCP Firestore**:
    *   Create a Google Cloud Project (e.g. `jaisheelmastiproject`).
    *   Enable **Cloud Firestore** and initialize it in **Native Mode**.
2.  **GCP Storage Bucket**:
    *   Initialize the default Cloud Storage bucket (e.g. `jaisheelmastiproject.firebasestorage.app`).
    *   If **Uniform Bucket-Level Access** is enabled, media assets must be read using tokenized URLs rather than `makePublic()` permissions.
3.  **Local Secrets Protection**:
    *   Add `.env`, `.env.*`, and `client/.firebase/` to your root `.gitignore` file immediately.
    *   Create a local template `client/.env.production` containing:
        ```env
        VITE_FIREBASE_API_KEY=your_api_key
        VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VITE_FIREBASE_PROJECT_ID=your_project_id
        VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
        VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
        VITE_FIREBASE_APP_ID=your_app_id
        ```

---

## 🔗 Step 3: Single-Origin Proxy & Local Integration

1.  **Single-Origin Routing (`firebase.json`)**:
    To prevent CORS problems and preflight request delays, configure Firebase Hosting to act as a reverse proxy that routes all `/api/**` traffic directly to your backend API hosted on Cloud Run:
    ```json
    {
      "hosting": {
        "public": "dist",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "/api/**",
            "run": {
              "serviceId": "mastimongsters-api",
              "region": "us-central1"
            }
          },
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    }
    ```
2.  **API Client Configuration**:
    Configure all client requests to target relative routes (e.g. `fetch('/api/members')`) rather than hardcoded URLs.

---

## 🔐 Step 4: Configuring Keyless Workload Identity Federation

Because modern GCP organizations block the creation of static Service Account JSON keys (`iam.disableServiceAccountKeyCreation` policy), we authenticate keylessly using **OIDC OpenID Connect tokens**.

Run these commands to set up the authentication trust between GitHub Actions and Google Cloud:

### 1. Create Deployment Service Account
```bash
gcloud iam service-accounts create "github-actions-deployer" \
    --project="jaisheelmastiproject" \
    --display-name="GitHub Actions Deployer"
```

### 2. Grant Required Permissions to the Service Account
```bash
gcloud projects add-iam-policy-binding "jaisheelmastiproject" \
    --member="serviceAccount:github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding "jaisheelmastiproject" \
    --member="serviceAccount:github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "jaisheelmastiproject" \
    --member="serviceAccount:github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com" \
    --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding "jaisheelmastiproject" \
    --member="serviceAccount:github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 3. Create Workload Identity Pool & Provider
```bash
# Create the identity pool
gcloud iam workload-identity-pools create "github-pool" \
    --project="jaisheelmastiproject" \
    --location="global" \
    --display-name="GitHub Actions Pool"

# Create the OIDC Provider with a condition restricting access ONLY to your repository
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --project="jaisheelmastiproject" \
    --location="global" \
    --workload-identity-pool="github-pool" \
    --display-name="GitHub Provider" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --attribute-condition="assertion.repository == 'crazycoolhunk-bot/mastimongsters'"
```

### 4. Authorize the GitHub Repository to Assume the Role
```bash
gcloud iam service-accounts add-iam-policy-binding "github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com" \
    --project="jaisheelmastiproject" \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/493144094484/locations/global/workloadIdentityPools/github-pool/attribute.repository/crazycoolhunk-bot/mastimongsters"
```

---

## 📦 Step 5: Save Repository Secrets & Push
1. Add the following repository secrets to your GitHub settings page:
   * `GCP_PROJECT_ID`: `jaisheelmastiproject`
   * `GCP_SERVICE_ACCOUNT`: `github-actions-deployer@jaisheelmastiproject.iam.gserviceaccount.com`
   * `GCP_WORKLOAD_IDENTITY_PROVIDER`: `projects/493144094484/locations/global/workloadIdentityPools/github-pool/providers/github-provider`
   * `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`, etc.
2. Commit and push the code:
   * GitHub Actions will validate that the code installs and builds successfully on **all** feature branches and pull requests.
   * If on the `main` branch, it will build the docker container, push it to Artifact Registry, deploy to Cloud Run, and output the updated version automatically!
