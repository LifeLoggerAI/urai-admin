# urai-admin

This is a production-ready Admin Console v1.0.

## How to run

1.  Install dependencies: `pnpm install`
2.  Run the development server: `pnpm dev`

## How to deploy

1.  Select the firebase project: `firebase use <project>`
2.  Deploy the application: `pnpm deploy`

## Env vars

Create a `.env.local` file with the following environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
```

## Roles

The available roles are:
*   **OWNER**: Has all permissions.
*   **ADMIN**: Has most permissions, except for managing roles and permissions.
*   **VIEWER**: Has read-only permissions.
