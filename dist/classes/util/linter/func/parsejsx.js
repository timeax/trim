"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
function parseJsx(src, linter = new eslint_1.Linter()) {
    linter.defineRule('jsx-parser', {
        meta: {
            type: 'problem',
            fixable: 'code',
            docs: {
                description: 'Rename all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => {
            function report(node, fix, context) {
                context.report({
                    message: 'Create global flow',
                    node: node,
                    fix: (fixer) => fix(fixer)
                });
            }
            return {
                JSXElement(node) {
                    let source = context.getSourceCode().getText(node);
                    let fix = `'-jsx-code- ${source}\'`;
                    report(node, fixer => fixer.replaceText(node, fix), context);
                }
            };
        }
    });
    return {
        verify() {
            let msg = linter.verifyAndFix(src, {
                rules: {
                    'jsx-parser': 'error',
                },
                env: { es6: true },
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'script',
                    ecmaFeatures: {
                        jsx: true,
                    },
                }
            });
            if (!msg.fixed && msg.messages.length > 0)
                throw msg.messages.map(item => item.message).join('\n');
            else {
                const messages = msg.messages.filter(item => (item.fatal == true || item.severity) && item.ruleId == 'extract-names');
                if (messages.length > 0)
                    throw (messages);
            }
            return msg.output;
        }
    };
}
exports.default = parseJsx;
