// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: ['eslint.config.mjs']
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            },
            sourceType: 'commonjs',
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        rules: {
            // TypeScript rules
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-this-alias": "off",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-unused-expressions": "off",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/triple-slash-reference": "off",

            // General rules with 4 spaces indentation
            "comma-dangle": ["error", "never"],
            "constructor-super": 1,
            "curly": ["error", "all"],
            "indent": [
                "error",
                4,
                {
                    "ignoredNodes": [
                        "FunctionExpression > .params[decorators.length > 0]",
                        "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
                        "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key"
                    ]
                }
            ],
            "no-console": 0,
            "no-const-assign": 1,
            "no-empty": 0,
            "no-extra-semi": 0,
            "no-fallthrough": 0,
            "no-mixed-spaces-and-tabs": 1,
            "no-redeclare": 0,
            "no-this-before-super": 1,
            "no-undef": 0,
            "no-unreachable": 1,
            "no-unused-vars": 1,
            "no-use-before-define": 0,
            "prefer-rest-params": "off",
            "quotes": ["error", "double", { "allowTemplateLiterals": true }],
            "semi": 0,
            "valid-typeof": 1
        }
    }
];