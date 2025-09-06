// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...compat.extends("next/core-web-vitals", "next/typescript"), {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: ["./tsconfig.json", "./.storybook/tsconfig.storybook.json"],
    },
  },
  ignores: [
    "eslint.config.mjs",
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
}, ...storybook.configs["flat/recommended"]];

export default eslintConfig;
