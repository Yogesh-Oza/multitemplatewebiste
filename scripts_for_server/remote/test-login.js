#!/usr/bin/env node
/** Test SVKK API login using credentials passed as args (not printed). */
const email = process.argv[2];
const password = process.argv[3];
const base = process.argv[4] ?? "http://127.0.0.1:4000";

if (!email || !password) {
  console.error("Usage: node test-login.js <email> <password> [baseUrl]");
  process.exit(1);
}

async function main() {
  const res = await fetch(`${base}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = { raw: body.slice(0, 200) };
  }
  console.log("status:", res.status);
  if (res.ok) {
    console.log("login: OK");
    console.log("user:", json.user?.email ?? json.email ?? "(unknown)");
    console.log("permissions:", Array.isArray(json.user?.permissions) ? json.user.permissions.length : "(n/a)");
  } else {
    console.log("login: FAILED");
    console.log("error:", json.message ?? json.error ?? JSON.stringify(json).slice(0, 200));
  }
  process.exit(res.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
