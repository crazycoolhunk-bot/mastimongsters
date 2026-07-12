# Masti Mongsters Branching Strategy

To keep the codebase stable and prevent accidental production outages, we follow a streamlined **GitHub Flow** branching model.

---

## 🌳 Branch Hierarchy

### 1. `main` (Production Branch)
* **Status**: Highly Protected.
* **Purpose**: Represents the current live production code running on Cloud Run and Firebase Hosting.
* **Deployment**: Pushes to this branch trigger the automated CI/CD deploy pipeline.
* **Rule**: Collaborators must **never** push code directly to `main`. All changes must go through a Pull Request.

### 2. `release/v2.0` (Stable Launch Branch)
* **Status**: Read-Only snapshot.
* **Purpose**: Captures the exact, stable state of the **v2.0 React Edition** launch. 
* **Usage**: If you ever need to rollback production or look at the original launch code, it is preserved here.

### 3. `feature/your-feature-name` (Development Branches)
* **Purpose**: Used for writing new features, UI components, or logic improvements.
* **Creation**: Branched off `main`.
* **CI Integration**: Pushing to these branches automatically runs the *Verify & Build* check in GitHub Actions to ensure nothing is broken.

### 4. `bugfix/issue-description` (Fix Branches)
* **Purpose**: Used for fixing bugs or syntax errors.
* **Creation**: Branched off `main`.

---

## 🔄 Daily Developer Workflow

Follow these steps when adding new changes:

### Step 1: Create a Feature Branch
Get the latest code from `main` and branch off:
```bash
git checkout main
git pull origin main
git checkout -b feature/add-new-metric
```

### Step 2: Write Code & Test Locally
Make your changes, then verify the frontend builds successfully:
```bash
npm run build --prefix client
```

### Step 3: Push and Trigger CI Verification
Push the branch to GitHub:
```bash
git add .
git commit -m "feat: Add new user activity metric to dashboard"
git push -u origin feature/add-new-metric
```
*GitHub Actions will immediately run the verification suite to ensure the build compiles cleanly.*

### Step 4: Open a Pull Request (PR)
1. Go to your GitHub repository page.
2. Click **Compare & pull request**.
3. Fill out the description and submit.
4. **Merge**: Once the automated check turns green (meaning it compiled successfully without errors) and is reviewed, merge the PR into `main`. The CI/CD pipeline will automatically deploy the update to your live site!
