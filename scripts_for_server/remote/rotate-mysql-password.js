#!/usr/bin/env node
/**
 * Rotate MySQL app user password and update backend .env DATABASE_URL.
 * Usage: node rotate-mysql-password.js [newPassword]
 */
const fs = require("node:fs");
const crypto = require("node:crypto");
const { execSync } = require("node:child_process");

const envFile = process.argv[2] ?? "/var/www/svkk-backend/.env";
const newPassword = process.argv[3] ?? crypto.randomBytes(24).toString("base64url");

if (!fs.existsSync(envFile)) {
  console.error(`Env file not found: ${envFile}`);
  process.exit(1);
}

const envText = fs.readFileSync(envFile, "utf8");
const match = envText.match(/^DATABASE_URL=(.+)$/m);
if (!match) {
  console.error("DATABASE_URL missing in .env");
  process.exit(1);
}

const raw = match[1].trim().replace(/^"|"$/g, "");
const url = new URL(raw.replace(/^mysql:/, "http:"));
const user = decodeURIComponent(url.username);
const oldPass = decodeURIComponent(url.password);
const host = url.hostname;
const port = url.port || "3306";
const db = url.pathname.slice(1).split("?")[0] || "vagadevents_svkkdb";

const oldEnv = { ...process.env, MYSQL_PWD: oldPass };
const newEnv = { ...process.env, MYSQL_PWD: newPassword };

function mysql(args, pwd) {
  return execSync(`mysql -h ${host} -P ${port} -u ${user} ${args}`, {
    env: { ...process.env, MYSQL_PWD: pwd },
    stdio: "pipe",
    shell: "/bin/bash",
  });
}

// Ensure user can connect with old password first
mysql("-e \"SELECT 1\"", oldPass);

const escapedForSql = newPassword.replace(/'/g, "''");
const escapedUser = user.replace(/'/g, "''");
const hostClauses =
  host === "localhost" || host === "127.0.0.1"
    ? ["'localhost'", "'127.0.0.1'"]
    : [`'${host}'`];

for (const hostClause of hostClauses) {
  mysql(
    `-e ${JSON.stringify(`ALTER USER '${escapedUser}'@${hostClause} IDENTIFIED BY '${escapedForSql}';`)}`,
    oldPass,
  );
}
mysql('-e "FLUSH PRIVILEGES;"', oldPass);

// Verify new password works
mysql("-e \"SELECT 1\"", newPassword);

const encodedUser = encodeURIComponent(user);
const encodedPass = encodeURIComponent(newPassword);
const newUrl = `mysql://${encodedUser}:${encodedPass}@${host}:${port}/${db}`;

const updated = envText.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${newUrl}"`);
fs.writeFileSync(envFile, updated, "utf8");

console.log("MySQL password rotated successfully.");
console.log(`  user: ${user}`);
console.log(`  database: ${db}`);
console.log(`  new_password: ${newPassword}`);
console.log("  .env updated at:", envFile);
