"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const __1 = __importDefault(require(".."));
function parseJsE(src, env, linter) {
    linter.defineRule('find-global-objects', {
        meta: {
            type: 'problem',
            fixable: 'code',
            docs: {
                description: 'Rename all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => ({
            Identifier(node) {
                const call = (node) => {
                    const report = (realName) => __1.default.report(context, fixer => fixer.replaceText(node, `global.__GLOBAL__.${realName}`), node);
                    //@ts-ignore
                    if (node.name.startsWith('$')) {
                        //@ts-ignore
                        const realName = node.name.substring(1, node.name.length);
                        const match = env.filter(item => item.name === realName);
                        if ((0, utilities_1.isEmpty)(match))
                            __1.default.reportErr(context, node, `Variable with name '${realName}' doesn't exist..`);
                        else if (node.parent.type == 'AssignmentExpression') {
                            if (!match.every(item => item.type == 'let' || item.type == 'var'))
                                __1.default.reportErr(context, node, `Cannot reassign variable '${realName}' `);
                            else
                                report(realName);
                        }
                        else
                            report(realName);
                    }
                };
                const type = node.parent.type;
                if (type === 'MemberExpression') {
                    const parent = (() => {
                        let refNode = node.parent;
                        while (refNode.type === 'MemberExpression') {
                            //@ts-ignore
                            if (refNode.parent.type == 'MemberExpression')
                                refNode = refNode.parent;
                            else
                                break;
                        }
                        return refNode;
                    })();
                    if ((0, utilities_1.is)(parent).null)
                        return;
                    //@ts-ignore 
                    const [start, main_start] = [node.start, parent.start];
                    if (start === main_start) {
                        call(node);
                    }
                }
                else {
                    if (node.parent.type == 'AssignmentExpression') {
                        //@ts-ignore
                        call(node);
                    }
                    else if (node.parent.type == 'ExpressionStatement')
                        call(node);
                }
            }
        })
    });
    return {
        verify() {
            const msg = linter.verifyAndFix(src, {
                parserOptions: {
                    ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: {
                        jsx: true
                    }
                }, env: { "es6": true }, rules: {
                    'find-global-objects': 'error',
                }
            });
            if (!msg.fixed && msg.messages.length > 0)
                throw msg.messages;
            return msg.output;
        }
    };
}
exports.default = parseJsE;
