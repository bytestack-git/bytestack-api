import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.ts", "src/**/*.js"],
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
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
  },
  // Import Resolver for TypeScript
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "import/no-unresolved": "error",
      "promise/always-return": "warn",
    },
  },
  // Ignore patterns
  {
    ignores: ["eslint.config.mjs", "node_modules/", "dist/", "**/*.test.ts"],
  },
];
