// Site-wide ceiling on analyses per UTC day, so a public demo can't run up the API bill.
// In memory: resets on restart and at UTC midnight.
const DAILY_CAP = Number.parseInt(process.env.DAILY_REQUEST_CAP || "200", 10);

let day = new Date().toISOString().slice(0, 10);
let count = 0;

export function tryConsumeDailyCap() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== day) {
    day = today;
    count = 0;
  }
  if (count >= DAILY_CAP) return false;
  count += 1;
  return true;
}
