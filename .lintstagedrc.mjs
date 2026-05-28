const oxlintCmd = "oxlint --type-aware --fix";

export default {
  "packages/api/**/*.{ts,mts}": [oxlintCmd, "oxfmt"],
  "packages/ui/**/*.{ts,tsx,mts}": [oxlintCmd, "oxfmt"],
  "*.{json,jsonc,yml,yaml,md}": "oxfmt",
};
