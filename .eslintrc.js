module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:node/recommended'],
  parserOptions: {
    ecmaVersion: 13,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': ['error', { allow: ['done', 'err', 'res', 'doc'] }],
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=8.3.0',
        ignores: ['spreadElements'],
      },
    ],
    camelcase: [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
        allow: [
          'issue_title',
          'issue_text',
          'created_on',
          'updated_on',
          'created_by',
          'assigned_to',
          'status_text',
        ],
      },
    ],
  },
};
