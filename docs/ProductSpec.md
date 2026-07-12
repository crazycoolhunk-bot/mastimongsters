# Masti Mongsters Portal - Product Specification

This document defines the product features, user roles, design guidelines, and technical integrations of the Masti Mongsters Portal.

---

## 👥 Core Credits
* **Idea Owner & Admin**: **Jaisheel** (Created the group in June 2012, defines product vision, acts as community administrator).
* **Architect**: **Rajesh** (Designed and implemented the serverless cloud topology, security architecture, and automated CI/CD pipelines).

---

## 🎯 Product Overview
The **Masti Mongsters Portal** is the digital headquarters for a private, highly active community of 75+ members founded in June 2012. The portal provides community tracking, announcements, sharing of meetups/photos, and an onboarding funnel for prospective members.

---

## 🌟 Core Features & Requirements

### 1. Home Dashboard
* **Purpose**: Serves as the landing page showing active metrics, pinning important alerts, and introducing the community.
* **Key Components**:
  * Pinned announcements carousel.
  * Quick links to other sections (Directory, Gallery).
  * Community statistics (e.g. Total Members, Years Active).

### 2. Member Directory (`/members`)
* **Purpose**: Lists all 75+ active members with search and filtering capabilities.
* **Performance Requirement**: Must handle large member directories smoothly. Implemented virtualized lists (`react-window`) to ensure 60fps scrolling performance.
* **Member Cards**: Displays member names, roles (`Active`, `Admin`, `VIP`, `Moderator`, `Legend`), Instagram handles, WhatsApp status, and biographies.

### 3. Gallery & Media Wall (`/gallery`)
* **Purpose**: A chronological wall of highlight photos from past meetups and road trips.
* **Upload Mechanics**:
  * Authenticated admins can upload photos.
  * Express API handles file streaming directly to the Google Cloud Storage bucket (`jaisheelmastiproject.firebasestorage.app`).
  * Persists photo documents to the Firestore `gallery` collection.

### 4. Announcements Board
* **Purpose**: Allows admins to publish notices to the group.
* **Mechanics**:
  * Notices can be "pinned" to stay at the top of the dashboard.
  * Chronologically ordered by publication date.

### 5. Onboarding Funnel (Join Us Form)
* **Purpose**: Allows prospective members to request an invite.
* **Fields**: Name, phone/WhatsApp number, referring member, reasons for joining, and Instagram handle.
* **Database**: Saves requests to the Firestore `requests` collection with an auto-incrementing integer ID.

---

## 🛠️ Constraints & Guidelines (For Developers & AI Agents)

1.  **Port Range Restriction**:
    *   All development servers and backend APIs must strictly bind to ports in the range **`8000 to 8500`**.
2.  **No Committed Secrets**:
    *   Never commit any `.env` files or hardcoded API keys. Keep all local environment configurations inside gitignored files (`.env.local`, `.env.production`, etc.).
3.  **Keyless Deployment (OIDC)**:
    *   Do not configure static JSON credentials files. The deployment workflow utilizes GitHub OIDC tokens running against Google Cloud **Workload Identity Federation (WIF)**.
4.  **Single-Origin Proxy**:
    *   The frontend (Firebase Hosting) proxies requests starting with `/api/` directly to Cloud Run. All backend API calls must target relative paths (`/api/...`) rather than hardcoded URLs.
