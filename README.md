# URAI Admin

This repository contains the administrative and operational control plane for the URAI ecosystem.

It is designed for **privileged internal use only**, with strict access controls, auditing, and role-based permissions enforced at runtime.

## Scope

This repository includes:
- Internal dashboards
- Moderation and review tools
- Job and pipeline oversight
- System health monitoring
- Incident response interfaces
- Administrative configuration surfaces

## Access Model

Access is restricted by:
- Authenticated identity
- Explicit role assignment
- Environment-level permissions
- Full audit logging

Possession of repository access does **not** imply runtime authority.

## Relationship to Other Repos

- `urai-labs-llc`: core product
- `urai-jobs`: background execution
- `urai-analytics`: metrics and insights
- `urai-admin`: **control and oversight**

This repo governs *operations*, not user experience.

## Status

This repository is security-sensitive.
All changes are reviewed, versioned, and auditable.
