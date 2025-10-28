// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import eslintPluginPrettierRecommended
	from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'out/**',
			'public/**',
			'*.config.js',
			'eslint.config.mjs',
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	eslintPluginPrettierRecommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			'react': react,
			'react-hooks': reactHooks,
			'jsx-a11y': jsxA11y,
			'@next/next': nextPlugin,
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',

			// React
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
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
);