import { defineFlatConfigs } from '@nuxt/eslint-config/flat'
import eslintConfigPrettier from 'eslint-config-prettier'
import prettier from 'eslint-plugin-prettier'
import vue from 'eslint-plugin-vue'
import typescript from '@typescript-eslint/eslint-plugin'
export default defineFlatConfigs(eslintConfigPrettier, {
  plugins: {
    prettier,
    vue,
    '@typescript-eslint': typescript,
  },
  rules: {
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['default', 'index'],
      },
    ],

    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'vue/valid-v-slot': ['error', { allowModifiers: true }],

    '@typescript-eslint/no-explicit-any': 'warn',

    'logical-assignment-operators': ['error', 'always'],
    'prefer-const': 1,
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': 'error',
    'no-alert': 'warn',
    'no-debugger': 'warn',
    'vue/require-default-prop': 0,
    'vue/html-indent': 'off',
    'vue/singleline-html-element-content-newline': 0,
    'no-unused-vars': 'off',
    'vue/no-v-html': 'warn',
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'avoid',
        bracketSpacing: true,
        endOfLine: 'lf',
        bracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 120,
        proseWrap: 'preserve',
        quoteProps: 'as-needed',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      },
    ],
  },
  ignores: [
    'node_modules/*',
    'dist/**/*',
    'out',
    'coverage',
    'test',
    'tests/**/*',
    'cypress',
    'tmp',
    'temp',
    'public',
    'static',
    'docs/**/*',
    '**/cache/**/*',
  ],
})
