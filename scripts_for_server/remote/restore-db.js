#!/usr/bin/env node
/**
 * Restore MySQL from a .sql dump using DATABASE_URL from backend .env.
 * Usage: node restore-db.js [/path/to/dump.sql] [/path/to/.env]
 */
const fs = require("node:fs");
const { execSync } = require("node:child_process");

const sqlFile = process.argv[2] ?? "/tmp/svkk_migrated.sql";
const envFile = process.argv[3] ?? "/var/www/svkk-backend/.env";

if (!fs.existsSync(sqlFile)) {
  console.error(`SQL file not found: ${sqlFile}`);
  process.exit(1);
}
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
const pass = decodeURIComponent(url.password);
const host = url.hostname;
const port = url.port || "3306";
const env = { ...process.env, MYSQL_PWD: pass };

function mysql(args, inherit = false) {
  return execSync(`mysql -h ${host} -P ${port} -u ${user} ${args}`, {
    env,
    stdio: inherit ? "inherit" : "pipe",
    shell: "/bin/bash",
  });
}

function mysqlQuery(query) {
  return mysql(`-N -e ${JSON.stringify(query)}`).toString().trim();
}

console.log("Dropping ransomware DB if present...");
try {
  mysqlQuery("DROP DATABASE IF EXISTS RECOVER_YOUR_DATA");
} catch {
  console.warn("Could not drop RECOVER_YOUR_DATA (may not exist)");
}

console.log("Recreating vagadevents_svkkdb...");
mysqlQuery("DROP DATABASE IF EXISTS vagadevents_svkkdb");
mysqlQuery(
  "CREATE DATABASE vagadevents_svkkdb CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci",
);

console.log(`Importing ${sqlFile} ...`);
execSync(`mysql -h ${host} -P ${port} -u ${user} < ${JSON.stringify(sqlFile)}`, {
  env,
  stdio: "inherit",
  shell: "/bin/bash",
});

const policies = mysqlQuery("SELECT COUNT(*) FROM vagadevents_svkkdb.policy");
const users = mysqlQuery("SELECT COUNT(*) FROM vagadevents_svkkdb.user");
const parties = mysqlQuery("SELECT COUNT(*) FROM vagadevents_svkkdb.insuredparty");

console.log("Restore complete.");
console.log(`  policies: ${policies}`);
console.log(`  users: ${users}`);
console.log(`  insured parties: ${parties}`);
