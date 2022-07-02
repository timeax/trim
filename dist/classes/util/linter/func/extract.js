"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAllVars = exports.resolveImports = void 0;
const eslint_1 = require("eslint");
const parsejsx_1 = __importDefault(require("./parsejsx"));
const __1 = __importDefault(require(".."));
function extract(src, linter = new eslint_1.Linter(), options = { env: [], useImports: true, id: 0 }) {
    let util = 'var require = global.require || global.process.mainModule.constructor._load; ';
    const code = resolveImports(src, linter, options.useImports);
    if (code.trim().includes('require('))
        src = code;
    let { names, env } = extractAllVars(src, linter, options.env, options.id).verify();
    let out = (0, parsejsx_1.default)(src, linter).verify();
    out = util + '\n' + out;
    return { env: env, names: names, out };
}
exports.default = extract;
function resolveImports(src, linter, use) {
    const results = [];
    linter.defineRule('get-imports', {
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
            function resolve(node, results) {
                let vars = null;
                switch (node.type) {
                    case 'ImportDefaultSpecifier':
                        vars = { imported: node.local.name, local: node.local.name, default: true };
                        results.push(vars);
                        break;
                    case 'ImportSpecifier':
                        vars = { imported: node.imported.name, local: node.local.name, default: false };
                        results.push(vars);
                        break;
                }
            }
            function build(file) {
                let format = 'const {name} = require("{path}"){specifier};';
                const text = file.imports.map(item => {
                    let res = '';
                    //@ts-ignore
                    if (item.default)
                        res = format.format({ name: item.local, path: file.src, specifier: '?.default' });
                    //@ts-ignore
                    else
                        res = format.format({ name: item.local, path: file.src, specifier: `.${item.imported}` });
                    return res;
                });
                return text.join('\n');
            }
            return {
                ImportDeclaration(node) {
                    if (!use)
                        __1.default.reportErr(context, node, `imports are not allowed here.. at ${context.getSourceCode().getText(node)}`);
                    const file = { src: node.source.value, imports: [] };
                    const { specifiers } = node;
                    specifiers.forEach(item => {
                        resolve(item, file.imports);
                    });
                    const code = build(file);
                    __1.default.report(context, fixer => fixer.replaceText(node, code), node);
                }
            };
        }
    });
    const msg = linter.verifyAndFix(src, {
        parserOptions: {
            ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: {
                jsx: true
            }
        }, env: { "es6": true }, rules: {
            'get-imports': 'error',
        }
    });
    if (!msg.fixed && msg.messages.length > 0)
        throw msg.messages;
    return msg.output;
}
exports.resolveImports = resolveImports;
function extractAllVars(src, linter = new eslint_1.Linter(), existing, id) {
    const names = [];
    const justNames = [];
    const fixTracker = [];
    linter.defineRule('extract-names', {
        meta: {
            type: 'problem',
            fixable: 'whitespace',
            docs: {
                description: 'Rename all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => {
            function loadIds(item, store, parent) {
                switch (item.type) {
                    case 'ArrayPattern':
                        item.elements.forEach(node => {
                            loadIds(node, store, parent);
                        });
                        break;
                    case 'Identifier':
                        if (existing.some(val => (item.name == val.name && val.id === id)))
                            __1.default.reportErr(context, item, `Variable '${item.name}' already exists.. at ${context.getSourceCode().getText(parent)}'`);
                        else if (item.name === 'props')
                            __1.default.reportErr(context, item, `'props' is a reserved keyword.. at '${context.getSourceCode().getText(parent)}' `);
                        else if (item.name === 'require')
                            __1.default.reportErr(context, item, `'require' is a reserved keyword.. at '${context.getSourceCode().getText(parent)}' `);
                        justNames.push(item.name);
                        store.names.push(item.name);
                        break;
                    case 'ObjectPattern':
                        item.properties.forEach(prop => {
                            loadprop(prop, store, parent);
                        });
                        break;
                    case 'RestElement':
                        loadIds(item.argument, store, parent);
                        break;
                }
            }
            function loadprop(prop, store, parent) {
                if (prop.type == 'Property')
                    return loadIds(prop.value, store, parent);
                else
                    return loadIds(prop, store, parent);
            }
            return {
                VariableDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    //@ts-ignore
                    const value = { type: node.kind, names: [] };
                    node.declarations.forEach(item => {
                        loadIds(item.id, value, node);
                    });
                    names.push(value);
                    fixTracker.push(source);
                },
                FunctionDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    //@ts-ignore
                    const value = { type: 'function', names: [] };
                    loadIds(node.id, value, node);
                    names.push(value);
                    fixTracker.push(source);
                },
                ClassDeclaration(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    //@ts-ignore
                    const value = { type: 'class', names: [] };
                    loadIds(node.id, value, node);
                    names.push(value);
                    fixTracker.push(source);
                }
            };
        }
    });
    return {
        verify() {
            let msg = linter.verify(src, {
                rules: {
                    'extract-names': 'error',
                },
                env: { es6: true },
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'script',
                    ecmaFeatures: {
                        jsx: true
                    },
                }
            });
            // console.log(msg)
            const messages = msg.filter(item => (item.fatal == true || item.severity) && item.ruleId == 'extract-names');
            if (messages.length > 0)
                throw (messages);
            return {
                env: names, names: justNames
            };
        }
    };
}
exports.extractAllVars = extractAllVars;
