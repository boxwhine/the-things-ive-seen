const oxlintCmd = "oxlint --type-aware --fix";

export default {
  "packages/api/**/*.{ts,mts}": [oxlintCmd, "prettier --write"],
  "packages/ui/**/*.{ts,tsx,mts}": [oxlintCmd, "prettier --write"],
  "*.{json,yml,yaml,md}": "prettier --write",
};
