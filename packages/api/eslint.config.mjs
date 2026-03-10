import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettier,
  {
    files: ["src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    ignores: ["build/**", "node_modules/**"],
  },
]);
