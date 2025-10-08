/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Add any custom rules here
  },
  ignorePatterns: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
};

export default eslintConfig;
