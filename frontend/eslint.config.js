import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import vue from "eslint-plugin-vue";

export default defineConfig(
  globalIgnores(["dist/"]),
  {
    files: ["**/*.vue"],
    extends: [vue.configs["flat/essential"]],
    rules: {
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
    },
    languageOptions: { parserOptions: { parser: tsParser } },
  },
  {
    files: ["src/**/*.test.ts"],
    extends: [testingLibrary.configs["flat/vue"], jestDom.configs["flat/recommended"]],
    languageOptions: { parser: tsParser },
  },
);
