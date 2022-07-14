"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eslint_1 = require("eslint");
const __1 = require("..");
function parseImport(src, linter = new eslint_1.Linter()) {
    const results = [];
    linter.defineRule('get-imports', {
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
            function importScanner(node, results) {
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
            return {
                ImportDeclaration(node) {
                    const file = { src: node.source.value, imports: [] };
                    const { specifiers } = node;
                    specifiers.forEach(item => {
                        importScanner(item, file.imports);
                    });
                    results.push(file);
                }
            };
        }
    });
    const msg = linter.verifyAndFix(src, {
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: {
            'get-imports': 'error',
        }
    });
    if (!msg.fixed && msg.messages.length > 0)
        throw new __1.CustomError(`${msg.messages.map(ms => {
            return `${ms.message}... \n   at ${ms.line}:${ms.column}`;
        }).join('\n')} \n   sourceCode: ${src}`, '');
    return results;
}
exports.default = parseImport;
