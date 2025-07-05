module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off', // Allow console for debugging
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': 'error',
    'curly': 'error',
    'no-global-assign': 'error',
    'no-implicit-globals': 'error',
  },
  globals: {
    // Global functions used across files
    StartOP: 'readonly',
    displayContents: 'readonly',
    checkForm: 'readonly',
    exportResults: 'readonly',
    copyToClipboard: 'readonly',
    showError: 'readonly',
    showSuccess: 'readonly',
    initializeDragAndDrop: 'readonly',
    addExportButtons: 'readonly',
  },
};
