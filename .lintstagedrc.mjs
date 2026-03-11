export default {
  "packages/api/**/*.{ts,mts}": ["eslint --fix", "prettier --write"],
  "packages/ui/**/*.{ts,tsx,mts}": ["eslint --fix", "prettier --write"],
  "*.{json,yml,yaml,md}": "prettier --write",
};
