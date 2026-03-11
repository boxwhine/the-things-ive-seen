const lintCmd = "eslint --fix --flag v10_config_lookup_from_file";

export default {
  "packages/api/**/*.{ts,mts}": [lintCmd, "prettier --write"],
  "packages/ui/**/*.{ts,tsx,mts}": [lintCmd, "prettier --write"],
  "*.{json,yml,yaml,md}": "prettier --write",
};
