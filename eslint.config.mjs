import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import tailwindcss from 'eslint-plugin-tailwindcss';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	{
		ignores: [
			'.next/**',
			'node_modules/**',
			'out/**',
			'public/**',
			'next-env.d.ts',
		],
	},
	...coreWebVitals,
	...nextTypescript,
	...tailwindcss.configs['flat/recommended'],
	mdx.flat,
	prettier,
	{
		plugins: {
			'unused-imports': unusedImports,
		},
		settings: {
			tailwindcss: {
				callees: ['cn', 'cva'],
				config: 'tailwind.config.js',
			},
		},
		rules: {
			// TS
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',

			// Next
			'@next/next/no-html-link-for-pages': 'off',

			// Tailwind
			'tailwindcss/no-custom-classname': 'off',
			'tailwindcss/classnames-order': 'warn',

			// Unused imports
			'@typescript-eslint/no-unused-vars': 'off',
			'no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	{
		files: ['**/*.mdx'],
		rules: {
			'react/jsx-no-undef': 'off',
			// unused-imports can't see component usage in MDX bodies and
			// auto-removes imports that are actually used — keep it off here.
			'unused-imports/no-unused-imports': 'off',
			'unused-imports/no-unused-vars': 'off',
		},
	},
];
