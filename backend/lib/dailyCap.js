// Site-wide ceiling on analyses per UTC day, so a public demo can't run up the API bill even if
// many IPs each stay under the per-IP rate limit. In memory: resets on restart, which is fine for
// a single small instance.
let day = "";
let count = 0;

export function tryConsumeDailyCap(limit = Number(process.env.DAILY_REQUEST_CAP) || 200, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    count = 0;
  }
  if (count >= limit) return false;
  count += 1;
  return true;
}

// Test helper.
export function resetDailyCap() {
  day = "";
  count = 0;
}
