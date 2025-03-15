// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    plugins: {
      import: pluginImport,
      promise: pluginPromise,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "commonjs",
      },
    },
  },
  // Custom rules
  {
    rules: {
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "import/no-unresolved": "error",
      "promise/always-return": "warn", // Now works with the plugin
    },
  },
  // Ignore patterns
  {
    ignores: ["node_modules/", "dist/", "**/*.test.ts"],
  },
];
