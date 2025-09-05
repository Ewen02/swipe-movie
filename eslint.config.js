const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-plugin-prettier');
const globals = require('globals');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Ignorés
  {
    ignores: [
      'node_modules',
      '**/dist',
      'apps/web/.next',
      'apps/web/out',
      '**/*.d.ts',
      'apps/api/prisma/migrations/**',
      'apps/api/prisma/**.db',
    ],
  },

  // Bases JS + TS
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Règles communes
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
      prettier,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Déclare explicitement les globals
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Qualité/TS
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Prettier intégré
      'prettier/prettier': ['error', { endOfLine: 'lf' }],
    },
  },

  // API (Nest)
  {
    files: ['apps/api/**/*.ts'],
    rules: { 'no-console': 'off' },
  },

  // Web (Next)
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
    languageOptions: { ecmaFeatures: { jsx: true } },
  },
];
