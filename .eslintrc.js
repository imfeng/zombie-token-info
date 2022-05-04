module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'array-bracket-spacing': 'off',
    "comma-dangle": ["error", {
        "arrays": "always",
        "objects": "always",
        "imports": "never",
        "exports": "never",
        "functions": "never"
    }],
    'vue/no-unused-components': 'warn',
    'space-before-function-paren': ['error', 'never'],
    'no-console': 'off', // process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'arrow-parens': ['error', 'as-needed', {
      requireForBlockBody: true
    }],
    'func-names': 'off',
    'linebreak-style': 'off',
    'no-nested-ternary': 'warn',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    // 'no-console': ['warn', {
    //   allow: ['warn', 'error']
    // }],
    'no-debugger': 'warn',
    'no-bitwise': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off', // _1X2 enums
    'class-methods-use-this': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'radix': ['error', 'as-needed'],
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: true,
    }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      ts: 'never',
      vue: 'always',
    }],
    'import/order': ['error', {
      alphabetize: {
        order: 'asc'
      }
    }],
    'no-use-before-define': 'off',
    'indent': ['error', 2, {
      SwitchCase: 1
    }],
    'curly': ['error', 'multi-line'],
    'brace-style': ['error', '1tbs'],
    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'lines-between-class-members': ['error', 'always', {
      exceptAfterSingleLine: true,
    }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['function', 'export'],
        next: ['function', 'export']
      },
    ],
    'object-curly-newline': ['error', {
      multiline: true,
      minProperties: 10,
      consistent: true
    }],
    'vue/no-use-v-if-with-v-for': 'off',
    'vue/v-bind-style': ['error', 'longform'],
    'vue/v-on-style': ['error', 'longform'],
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'vue/padding-line-between-blocks': ['error', 'always'],
    'vue/html-indent': ['error', 4],
    // 'vue/script-indent': ['error', 4, {
    //   baseIndent: 1,
    //   switchCase: 1,
    // }],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'always',
    }],
    'vue/html-closing-bracket-spacing': ['error', {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always',
    }],
    'vue/attribute-hyphenation': ['error', 'never', {
      ignore: [],
    }],
    'vue/require-default-prop': 'error',
    'vue/no-multi-spaces': ['error', {
      ignoreProperties: false
    }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {
      registeredComponentsOnly: false,
      ignores: ['i18n', 'component'],
    }],
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
    }],
    'vue/order-in-components': ['error', {
      order: [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        'emits',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'apollo',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'head',
        ['template', 'render'],
        'renderError',
      ],
    }],
    // 'lodash/import-scope': [2, 'method'],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-misused-new': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/type-annotation-spacing': 2,
    '@typescript-eslint/no-use-before-define': ['error', {
      functions: false,
      classes: false,
      enums: false,
      typedefs: false,
    }],
    '@typescript-eslint/no-empty-function': 'warn'
  },
  overrides: [{

    files: [
      '**/__tests__/*.{j,t}s?(x)',
      '**/tests/unit/**/*.spec.{j,t}s?(x)'
    ],
    env: {
      jest: true
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', {
        js: 'never',
        ts: 'never',
        vue: 'always',
      }],
    }
  }]
}
