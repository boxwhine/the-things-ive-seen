import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn"],
  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: "warn",
  },
  rules: {
    "eslint/capitalized-comments": "off",
  },
  env: { builtin: true },
});
