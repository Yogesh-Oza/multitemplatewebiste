#!/usr/bin/env node
/** Verify restored DB row counts using backend .env credentials. */
const fs = require("node:fs");
const { execSync } = require("node:child_process");

const envFile = process.argv[2] ?? "/var/www/svkk-backend/.env";
const envText = fs.readFileSync(envFile, "utf8");
const match = envText.match(/^DATABASE_URL=(.+)$/m);
if (!match) process.exit(1);

const raw = match[1].trim().replace(/^"|"$/g, "");
const url = new URL(raw.replace(/^mysql:/, "http:"));
const user = decodeURIComponent(url.username);
const pass = decodeURIComponent(url.password);
const host = url.hostname;
const port = url.port || "3306";
const env = { ...process.env, MYSQL_PWD: pass };

function q(sql) {
  return execSync(
    `mysql -h ${host} -P ${port} -u ${user} -N -e ${JSON.stringify(sql)}`,
    { env, encoding: "utf8" },
  ).trim();
}

console.log("tables:", q("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='vagadevents_svkkdb'"));
console.log("policies:", q("SELECT COUNT(*) FROM vagadevents_svkkdb.policy"));
console.log("users:", q("SELECT COUNT(*) FROM vagadevents_svkkdb.user"));
console.log("insured parties:", q("SELECT COUNT(*) FROM vagadevents_svkkdb.insuredparty"));
