// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  // 1️⃣ Ignore files ESLint must never lint
  {
    ignores: ["dist", "node_modules", "eslint.config.mjs","jest.config.js",]
  },

  // 2️⃣ Base JS rules (safe everywhere)
  eslint.configs.recommended,

  // 3️⃣ TypeScript rules WITHOUT type info (safe everywhere)
  ...tseslint.configs.recommended,

  // 4️⃣ Type-aware rules ONLY for TS source files
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    },
    rules: {
      // ...tseslint.configs.recommendedTypeChecked.rules
    }
  }
);
