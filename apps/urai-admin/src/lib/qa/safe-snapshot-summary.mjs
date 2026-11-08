// Server-side QA artifact summaries. Never return raw console messages,
// arbitrary URLs/query strings, or unvalidated snapshot keys to a browser.
const MAX_LINKS = 5000;
const MAX_SCREENSHOTS = 5000;
const MAX_CONSOLE_ENTRIES = 5000;
const SAFE_KEY = /^[a-zA-Z0-9_/-]{1,160}$/;
const SAFE_TAG = /^[a-zA-Z0-9_-]{1,80}$/;

function plainRecord(value) {
  return value !== null && typeof value === 'object' &&
    !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

export function safeQaTag(value) {
  return typeof value === 'string' && SAFE_TAG.test(value);
}

export function parseQaSnapshot(bytes) {
  const source = JSON.parse(bytes.toString('utf8'));
  if (!plainRecord(source)) throw new Error('Invalid QA snapshot');
  const links = source.links ?? {};
  const screenshots = source.screenshots ?? {};
  const errors = source.console ?? [];
  if (!plainRecord(links) || !plainRecord(screenshots) || !Array.isArray(errors)) {
    throw new Error('Invalid QA snapshot fields');
  }
  if (Object.keys(links).length > MAX_LINKS || Object.keys(screenshots).length > MAX_SCREENSHOTS ||
      errors.length > MAX_CONSOLE_ENTRIES) {
    throw new Error('QA snapshot exceeds entry limits');
  }
  const linkRecords = Object.entries(links).map(([url, status]) => {
    // Report only page path, never query, hash, credentials, or host data.
    const candidate = new URL(url);
    const route = candidate.pathname;
    if (!route.startsWith('/') || route.length > 160 ||
        !Number.isInteger(status) || status < 100 || status > 599) {
      throw new Error('Invalid QA link record');
    }
    return { path: route, status };
  });
  const screenshotRecords = Object.entries(screenshots).map(([key, digest]) => {
    if (!SAFE_KEY.test(key) || key.includes('..') ||
        typeof digest !== 'string' || !/^[a-f0-9]{64}$/i.test(digest)) {
      throw new Error('Invalid QA screenshot record');
    }
    return { key, digest };
  });
  // Console entries may contain secrets, tokens, private data or arbitrary JS.
  // Only the count is reportable; do not stringify the entries.
  return { links: linkRecords, screenshots: screenshotRecords, consoleErrorCount: errors.length };
}

export function qaLogSummary(snapshot) {
  return {
    brokenLinks: snapshot.links.filter((entry) => entry.status !== 200),
    consoleErrorCount: snapshot.consoleErrorCount,
    // Backward compatible field name, but raw console text is forbidden.
    consoleErrors: [],
  };
}

export function qaDiffSummary(previous, current, prevTag, currTag) {
  if (!safeQaTag(prevTag) || !safeQaTag(currTag)) throw new Error('Invalid QA tag');
  const earlier = new Map(previous.screenshots.map(({ key, digest }) => [key, digest]));
  const changes = current.screenshots
    .filter(({ key, digest }) => earlier.has(key) && earlier.get(key) !== digest)
    .map(({ key }) => ({ key: key.replace(/[^a-zA-Z0-9_-]/g, '_') }));
  // Return an opaque, caller-addressable QA image locator, never the server's
  // absolute file system paths.
  return { visualRegressions: changes, previousTag: prevTag, currentTag: currTag };
}
