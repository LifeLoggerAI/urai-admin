# URAI Admin Console

This document provides instructions for setting up and managing the URAI Admin Console.

## Project Overview

The URAI Admin Console is a web-based interface for managing the URAI platform. It provides role-based access control (RBAC) to various administrative functions, including user management, feature flag control, and audit logging.

## Prerequisites

Before you begin, ensure you have the following:

*   Node.js (v20 or later)
*   Firebase CLI (latest version)
*   Access to the URAI Firebase project
*   A Google Cloud service account key file with appropriate permissions for the project.

## Setup Instructions

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Configure Firebase:**

    *   Log in to Firebase:

        ```bash
        firebase login
        ```

    *   Set the active Firebase project:

        ```bash
        firebase use urai-4dc1d
        ```

3.  **Bootstrap the First Superadmin:**

    *   Create a new user in the Firebase Authentication console (or use an existing one).
    *   Copy the user's email and UID.
    *   Create a `.env.local` file by copying the `.env.example` file:

        ```bash
        cp .env.example .env.local
        ```

    *   Open `.env.local` and set the `SUPERADMIN_EMAIL` and `SUPERADMIN_UID` with the user's credentials.
    *   Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your service account key file:

        ```bash
        export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
        ```

    *   Run the bootstrap script:

        ```bash
        npx ts-node scripts/bootstrap-superadmin.ts
        ```

## Deployment

To deploy the admin console and all associated Firebase resources, run the following command:

```bash
firebase deploy
```

This will deploy:

*   Firestore rules (`firestore.rules`)
*   Storage rules (`storage.rules`)
*   Firebase Functions (from the `functions` directory)
*   The admin console web app (from the `apps/admin-web/public` directory)

## Verification Checklist

After deployment, verify the following:

*   [ ] **Login:** You can log in to the admin console with the superadmin account.
*   [ ] **Role Gates:** Access to superadmin-only pages (like `/admins`) is restricted for non-superadmin users.
*   [ ] **Rules:** Non-admin users cannot access or modify data in Firestore or Storage.
*   [ ] **Audit Logs:** Admin actions (like setting a user's role) create new entries in the `auditLogs` collection.
*   [ ] **Hosting:** The admin console is accessible at the project's hosting URL, and protected routes redirect to the login page.
