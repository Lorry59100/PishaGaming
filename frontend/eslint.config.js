import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'no-unused-vars': ['error', { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false }],
      'react/react-in-jsx-scope': 'off', // Désactive la règle 'react-in-jsx-scope'
      'react/no-unescaped-entities': 'off', // Désactive la règle 'no-unescaped-entities'
    },
  },
];
