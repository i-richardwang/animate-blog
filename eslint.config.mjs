import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ['.next/**', '.source/**', 'out/**', 'public/**', 'next-env.d.ts'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs.flat.recommended,
  pluginNext.configs['core-web-vitals'],
  {
    settings: { react: { version: 'detect' } },
    rules: {
      // The JSX transform doesn't need React in scope, and props are typed
      // with TypeScript.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    // Satori styles OG image elements through a `tw` prop.
    files: ['lib/og.tsx'],
    rules: {
      'react/no-unknown-property': ['error', { ignore: ['tw'] }],
    },
  },
  {
    // Animate UI code is installed by the shadcn CLI and kept as upstream
    // ships it. It predates the React Compiler rules.
    files: [
      'components/animate-ui/**',
      'hooks/use-auto-height.tsx',
      'hooks/use-controlled-state.tsx',
    ],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  eslintConfigPrettier,
];
