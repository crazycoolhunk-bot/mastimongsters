# Masti Mongsters Project Rules

## Port Range Restriction
- All web applications, development servers, and backend services in this project must use ports strictly in the range **8000 to 8500** to prevent port conflicts with other applications.

## Project Architecture & Guidelines
- Follow the React + Express + Firestore + Storage Architecture documented in [docs/architecture.md](file:///Users/rajeshkorrapati/RajK-Labs/JaisheelProject/docs/architecture.md).
- Follow the Git branching strategy documented in [docs/branching_strategy.md](file:///Users/rajeshkorrapati/RajK-Labs/JaisheelProject/docs/branching_strategy.md).
- Ensure CI/CD variables are maintained as GitHub Secrets and keyless authentication via Workload Identity Federation is used (documented in [docs/cicd_setup.md](file:///Users/rajeshkorrapati/RajK-Labs/JaisheelProject/docs/cicd_setup.md)).
- Follow the step-by-step setup and deployment playbook documented in [docs/setup_playbook.md](file:///Users/rajeshkorrapati/RajK-Labs/JaisheelProject/docs/setup_playbook.md).
- Do not commit any `.env` or credential files (secured by `.gitignore`).
