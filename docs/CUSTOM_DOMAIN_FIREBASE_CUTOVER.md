# Custom domain Firebase cutover

Status: Firebase deploy succeeded, but `uraiadmin.com` is still serving Squarespace.

## Evidence

Firebase Hosting release completed successfully and reported:

```text
Hosting URL: https://urai-admin.web.app
```

Post-deploy `curl -I` checks against `https://uraiadmin.com/login`, `https://uraiadmin.com/admin`, and `https://uraiadmin.com/api/admin/users` returned `server: Squarespace`, which means the custom domain has not been cut over to Firebase Hosting yet.

## Immediate validation

Verify the Firebase-hosted app directly:

```bash
curl -I https://urai-admin.web.app/login
curl -I https://urai-admin.web.app/admin
curl -I https://urai-admin.web.app/api/admin/users
```

Expected:

- `/login` returns the Firebase-hosted admin app.
- `/admin` either redirects to login or serves the protected app shell depending on auth/session behavior.
- `/api/admin/users` should not expose public data when unauthenticated.

## Cutover task

In Firebase Console, add or verify the custom domain for the `urai-admin` hosting site, then update DNS at the domain registrar/DNS provider so `uraiadmin.com` points to Firebase Hosting instead of Squarespace.

Do not remove the existing Squarespace records until Firebase shows the required DNS target records and the owner/operator is ready for cutover.

## After DNS change

Run:

```bash
dig uraiadmin.com
curl -I https://uraiadmin.com/login
curl -I https://uraiadmin.com/admin
curl -I https://uraiadmin.com/api/admin/users
```

The response headers should no longer show `server: Squarespace`.
