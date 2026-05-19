
---

## Production deploy evidence — URAI Admin

Date: 2026-05-19
Project: urai-4dc1d
Hosting URL: https://urai-admin.web.app
Console: https://console.firebase.google.com/project/urai-4dc1d/overview

Deploy result: PASS

Deployed:
- Firestore rules
- Firestore indexes
- Storage rules
- Functions
- Hosting

Updated Functions:
- aggregateAnalytics
- api_health
- admin_whoami
- nextServer

Important operator choices:
- Did not delete extra Firestore indexes.
- Did not delete unrelated existing Functions.

Production verification result: PASS

Verified:
- Homepage loads and contains URAI Admin/URAI.
- Login page loads.
- Protected /admin page returns 200.
- Anonymous /api/admin/users returns 401.
- Functions health endpoint is OK.
- Functions auth blocks anonymous access.

Production URL:
https://urai-admin.web.app

Final status: PRODUCTION DEPLOYED / VERIFIED on Firebase Hosting URL.

