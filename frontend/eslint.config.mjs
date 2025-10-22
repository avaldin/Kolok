import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';

export default [
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'@typescript-eslint': typescript,
			'react': react,
			'react-hooks': reactHooks,
			'jsx-a11y': jsxA11y,
			'@next/next': nextPlugin,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
				project: './tsconfig.json',
			},
			globals: {
				process: `readonly`,
				React: 'readonly',
				JSX: 'readonly',
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			// TypeScript strict
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', {}],
			'@typescript-eslint/explicit-function-return-type': ['warn', {
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
			}],
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/strict-boolean-expressions': 'warn',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/await-thenable': 'error',

			// React exigeant
			'react/prop-types': 'off', // On utilise TypeScript
			'react/react-in-jsx-scope': 'off', // Next.js n'en a pas besoin
			'react/jsx-no-target-blank': 'error',
			'react/jsx-key': 'error',
			'react/no-array-index-key': 'warn',
			'react/self-closing-comp': 'error',
			'react/jsx-curly-brace-presence': ['error', {
				props: 'never',
				children: 'never',
			}],

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			// Accessibilité
			'jsx-a11y/alt-text': 'error',
			'jsx-a11y/anchor-is-valid': 'error',
			'jsx-a11y/click-events-have-key-events': 'warn',
			'jsx-a11y/no-static-element-interactions': 'warn',

			// Next.js
			'@next/next/no-html-link-for-pages': 'error',
			'@next/next/no-img-element': 'error',

			// Bonnes pratiques générales
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'eqeqeq': ['error', 'always'],
			'prefer-const': 'error',
			'no-var': 'error',
		},
	},
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'out/**',
			'public/**',
			'*.config.js',
		],
	},
];