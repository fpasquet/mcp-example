import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import turboPlugin from "eslint-plugin-turbo";
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const baseConfig = [
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    ...perfectionist.configs['recommended-natural'],
    rules: {
      'perfectionist/sort-classes': [
        'error',
        {
          partitionByComment: true,
          type: 'natural',
        },
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          internalPattern: ['^@/.*'],
          type: 'natural',
        },
      ],
    },
  },
  {
    ignores: ['eslint.config.js', '.prettierrc.mjs', 'dist/**'],
  },
];