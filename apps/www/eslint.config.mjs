import { nextJsConfig } from '@workspace/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default [
  // `next lint` used to ignore these for us; plain `eslint .` does not.
  {
    ignores: [
      '.next/**',
      '.source/**',
      'out/**',
      'public/**',
      '__registry__/**',
      'next-env.d.ts',
    ],
  },
  ...nextJsConfig,
];
