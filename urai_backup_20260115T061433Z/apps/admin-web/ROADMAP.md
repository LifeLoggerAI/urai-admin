# URAI Admin Console: Roadmap & Version Plan

This document outlines the phased development and deployment plan for the `urai-admin` console, the central nervous system for the URAI ecosystem.

## Versioning Strategy

- **V0 (Baseline Polish):** Establish the core structure, premium UI/UX, design system, and a stable, type-safe foundation. **(Target: Initial Commit)**
- **V1 (Ship-Ready Admin):** Implement all critical, end-to-end workflows required for launch. **(Target: TODAY)**
- **V2 (Ops Hardening):** Add features for operational efficiency, monitoring, and proactive administration. **(Target: Post-Launch)**
- **V3 (Scale):** Introduce enterprise-grade features for multi-tenancy, advanced compliance, and large-scale data management. **(Target: Future)**

---

## V1 (Ship-Ready): Core Features

### Auth & RBAC
- **Routes:** `/login`, `/logout`
- **Middleware:** Protect all `/admin/*` routes.
- **Components:** Role-gating components/hooks for client and server.
- **Backend:** Firebase Function `setCustomClaims` for role management (superadmin only).

### Core Pages & Routes
- `/admin/dashboard`: KPIs, recent activity, system status.
- `/admin/users`: Search, filter, and view all users.
- `/admin/users/[uid]`: View user profile, metadata, manage roles, and status (enable/disable).
- `/admin/leads`: View waitlist/leads, filter, and export to CSV.
- `/admin/leads/[id]`: View detailed lead information and manage status.
- `/admin/demo-access`: Grant and revoke access to the demo environment.
- `/admin/broadcast`: Compose and send mock broadcasts to user segments.
- `/admin/audit-logs`: View immutable audit trail of all admin actions.
- `/admin/settings`: Manage system-wide feature flags.

### Backend & Data Models

**Firestore Collections:**
- `adminUsers/{uid}`: Mirrors admin-specific data and roles.
- `auditLogs/{id}`: (Immutable) `{ timestamp, actor, action, target, details }`
- `leads/{id}`: `{ email, name, status, createdAt, notes }`
- `featureFlags/{key}`: `{ value, description }`
- `demoAccess/{uid}`: `{ granted, expires }`

**Cloud Functions (Callable):**
- `getDashboardStats()`
- `listUsers()`, `getUser(uid)`
- `setCustomClaims(uid, role)`, `toggleUserStatus(uid, status)`
- `listLeads()`, `getLead(id)`, `updateLeadStatus(id, status)`, `exportLeadsCSV()`
- `listDemoAccess()`, `grantDemoAccess(uid)`, `revokeDemoAccess(uid)`
- `listAuditLogs()`
- `listFeatureFlags()`, `setFeatureFlag(key, value)`
- `sendBroadcast(segment, subject)`

---

## Roles & Permissions Matrix (V1)

| Action                     | superadmin | admin | support | analyst |
|----------------------------|:----------:|:-----:|:-------:|:-------:|
| **Users**                  |            |       |         |         |
| View Users/Profile         |      ✅     |   ✅   |    ❌    |    ❌    |
| Set User Role              |      ✅     |   ❌   |    ❌    |    ❌    |
| Disable/Enable User        |      ✅     |   ✅   |    ❌    |    ❌    |
| **Leads**                  |            |       |         |         |
| View/Export Leads          |      ✅     |   ✅   |    ✅    |    ❌    |
| Update Lead Status         |      ✅     |   ✅   |    ❌    |    ❌    |
| **Settings/Flags**         |            |       |         |         |
| View Flags                 |      ✅     |   ✅   |    ✅    |    ✅    |
| Set/Update Flags           |      ✅     |   ✅   |    ❌    |    ❌    |
| **Demo Access**            |      ✅     |   ✅   |    ❌    |    ❌    |
| **Audit/Broadcast**        |            |       |         |         |
| View Audit Logs            |      ✅     |   ✅   |    ❌    |    ✅    |
| Send Broadcast             |      ✅     |   ✅   |    ❌    |    ❌    |

---

## Deployment Checklist

1.  **Dependencies:** Run `pnpm install` at root to sync all workspaces.
2.  **Build Functions:** Run `pnpm -C functions build`.
3.  **Build Admin App:** Run `pnpm -C apps/admin-web build`.
4.  **Deploy:** Run `firebase deploy --only hosting,functions,firestore -P urai-4dc1d`.
5.  **Smoke Test:** Run `bash scripts/smoke-test.sh` to verify endpoints are live.

