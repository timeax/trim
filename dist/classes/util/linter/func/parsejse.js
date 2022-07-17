"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const trim_lint_1 = require("trim-lint");
const utilities_1 = require("@timeax/utilities");
const __1 = __importStar(require(".."));
function parseJsE(src, env, linter) {
    linter.defineParser('trim-lint-parser', {
        parse(text, options) {
            return (0, trim_lint_1.parse)(text, options);
        },
    });
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
        create: (context) => {
            function loadExpressions(node, base, call) {
                let _main = null;
                switch (node.type) {
                    case 'MemberExpression':
                        const parent = getRoot(node, 'MemberExpression', 'object');
                        //@ts-ignore
                        if (parent.start === base.start)
                            call(base);
                        break;
                    default:
                        if (node.type.includes('Expression'))
                            call(base);
                        else if (node.type == 'VariableDeclarator') {
                            if (node.id === base && base.name.startsWith('$'))
                                __1.default.reportErr(context, node, `TypeError... can't start identifier with dollor sign in JsScript tag...`);
                            else if (node.init === base)
                                call(base);
                        }
                        break;
                }
            }
            function getRoot(node, name, id) {
                if (node.type == name) {
                    //@ts-ignore
                    return getRoot(node[id]);
                }
                return node;
            }
            function getText(node) {
                return context.getSourceCode().getText(node);
            }
            return {
                Identifier(node) {
                    const call = (node) => {
                        const report = (realName) => __1.default.report(context, fixer => fixer.replaceText(node, `global.__GLOBAL__.${realName}`), node);
                        if (node.name.startsWith('$')) {
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
                    // const type = node.parent.type;
                    // console.log(type, node.name)
                    loadExpressions(node.parent, node, call);
                }
            };
        }
    });
    return {
        verify() {
            const msg = linter.verifyAndFix(src, {
                parser: 'trim-lint-parser',
                parserOptions: {
                    ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: {
                        jsx: true
                    }
                }, env: { "es6": true }, rules: {
                    'find-global-objects': 'error',
                }
            });
            if (!msg.fixed && msg.messages.length > 0)
                throw new __1.CustomError(`${msg.messages.map(ms => {
                    return `${ms.message}... \n   at ${ms.line}:${ms.column}`;
                }).join('\n')} \n   sourceCode: ${src}`, '');
            return msg.output;
        }
    };
}
exports.default = parseJsE;
