#!/usr/bin/env node
const fs = require("node:fs");
const { execSync } = require("node:child_process");
const envFile = process.argv[2] ?? "/var/www/svkk-backend/.env";
const envText = fs.readFileSync(envFile, "utf8");
const match = envText.match(/^DATABASE_URL=(.+)$/m);
const raw = match[1].trim().replace(/^"|  |"$/g, "").replace(/^"|"$/g, "");
const url = new URL(raw.replace(/^mysql:/, "http:"));
const env = { ...process.env, MYSQL_PWD: decodeURIComponent(url.password) };
const out = execSync(
  `mysql -h ${url.hostname} -P ${url.port || 3306} -u ${decodeURIComponent(url.username)} vagadevents_svkkdb -N -e "SELECT email, name FROM user ORDER BY email LIMIT 20"`,
  { env, encoding: "utf8" },
);
console.log(out);
