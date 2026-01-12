#!/bin/bash
set -euo pipefail

# The Firebase Hosting URL for the project.
# IMPORTANT: This needs to match your actual Firebase project URL.
URL="https://urai-4dc1d.web.app"

echo "Smoke Test: Checking deployed site endpoints at ${URL}..."

# 1. Check if the login page is reachable and contains expected text.
# We use `-L` to follow redirects, as Firebase Hosting might redirect.
if curl -sL "${URL}/login" | grep -q "Sign in"; then
  echo "✅ SUCCESS: Login page is up and responding correctly."
else
  echo "❌ FAILURE: Could not reach login page or find expected content."
  exit 1
fi

# 2. Check that a protected admin page returns a 200 status code.
# This is a basic check. In a real scenario, it would redirect to login, but since our middleware
# and client-side routing handles that, we are checking if the page itself loads.
# A more advanced test would require authenticated requests.
STATUS_CODE=$(curl -o /dev/null -sL -w "%{http_code}" "${URL}/admin/dashboard")

# Depending on the server/CDN configuration, a protected route might return 200 (and the client redirects) or 404/302.
# For this test, we accept 200 as it means the Next.js app is being served.
if [ "$STATUS_CODE" -eq "200" ]; then
    echo "✅ SUCCESS: Protected page /admin/dashboard served (Status: $STATUS_CODE). Client-side auth will handle the rest."
else
    echo "⚠️ WARNING: Protected page /admin/dashboard returned non-200 status (Status: $STATUS_CODE). This might be okay if a server-level redirect is in place."
fi

# 3. Check a non-existent page to ensure it returns a 404.
NOT_FOUND_CODE=$(curl -o /dev/null -sL -w "%{http_code}" "${URL}/a-page-that-does-not-exist")
if [ "$NOT_FOUND_CODE" -eq "404" ]; then
    echo "✅ SUCCESS: Non-existent page correctly returns a 404 status."
else
    echo "❌ FAILURE: Non-existent page returned an unexpected status code: ${NOT_FOUND_CODE}."
    exit 1
fi

echo "Smoke test passed! The application appears to be deployed and responding."
