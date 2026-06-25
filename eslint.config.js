import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    {
        ignores: ['node_modules', 'dist', 'build'], // Ignore unnecessary directories
    },
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: globals.browser,
            parser: tsParser, // TypeScript parser
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            'react-refresh/only-export-components': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    js.configs.recommended, // Include JavaScript recommended rules
    tseslint.configs.recommended, // Include TypeScript recommended rules
];
