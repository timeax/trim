"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressionLinter = void 0;
const eslint_1 = require("eslint");
function extractExp(src, linter = new eslint_1.Linter()) {
    let result = [];
    linter.defineRule('getVars', {
        meta: {
            type: 'layout',
            fixable: 'whitespace',
            docs: {
                description: 'Extract all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => {
            function loadExpressions(node, store = []) {
                switch (node.type) {
                    case 'SequenceExpression':
                        for (const obj of node.expressions)
                            loadExpressions(obj, store);
                        break;
                    default:
                        store.push({ src: context.getSourceCode().getText(node), type: node.type });
                        break;
                }
                return store;
            }
            return {
                ExpressionStatement(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    const vars = loadExpressions(node.expression);
                    result = vars;
                }
            };
        }
    });
    const msg = linter.verify(src, {
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: {
            'getVars': 'error',
        }
    });
    if (msg.some(item => item.fatal))
        throw (msg[0].message);
    return result;
}
exports.default = extractExp;
function expressionLinter(source, linter = new eslint_1.Linter()) {
    const fixTracker = [];
    linter.defineRule('code-checker', {
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
            function getName(args) {
                if (args.startsWith('global'))
                    return args;
                return `_$.${args}`;
            }
            function loadExpressions(node, store = []) {
                let refracted = [];
                let item;
                switch (node.type) {
                    case 'Identifier':
                        store.push({
                            method: 'replaceText',
                            props: {
                                useRange: false,
                                node: node,
                                text: getName(node.name),
                                //@ts-ignore
                                range: [node.start, node.end]
                            }
                        });
                        break;
                    case 'Literal':
                        store.push({
                            method: 'replaceText',
                            props: {
                                useRange: false,
                                node: node,
                                text: `${node.raw}`,
                                //@ts-ignore
                                range: [node.start, node.end]
                            }
                        });
                        break;
                    case 'ArrayExpression':
                        for (const obj of node.elements) {
                            if (obj.type == 'SpreadElement') {
                                loadExpressions(obj.argument, store);
                            }
                            else
                                loadExpressions(obj, store);
                        }
                        break;
                    case 'MemberExpression':
                        item = getRoot(node, 'MemberExpression', 'object');
                        return loadExpressions(item, store);
                    case 'CallExpression':
                        item = node.callee;
                        //@ts-ignore
                        node.arguments.forEach(arg => loadExpressions(arg, store));
                        loadExpressions(item, store);
                        break;
                    case 'TemplateLiteral':
                    case 'SequenceExpression':
                        for (const obj of node.expressions) {
                            const arr = loadExpressions(obj, store);
                        }
                        break;
                    case 'LogicalExpression':
                        return logical(node, store, 'LogicalExpression');
                    case 'AssignmentExpression':
                        return logical(node, store, 'AssignmentExpression');
                    case 'ConditionalExpression':
                        return conditional(node, store);
                    case 'UpdateExpression':
                        return loadExpressions(node.argument, store);
                    case 'BinaryExpression':
                        return logical(node, store, 'BinaryExpression');
                    case 'ChainExpression':
                        return loadExpressions(node.expression, store);
                    case 'UnaryExpression':
                        return loadExpressions(node.argument, store);
                }
                return store;
            }
            function getRoot(node, name, id) {
                if (node.type == name) {
                    //@ts-ignore
                    return getRoot(node[id]);
                }
                return node;
            }
            function conditional(node, store) {
                loadExpressions(node.test, store);
                loadExpressions(node.alternate, store);
                loadExpressions(node.consequent, store);
                return store;
            }
            function logical(node, store, name) {
                loadExpressions(node.right, store);
                // console.log(store)
                if (node.left.type == name) {
                    //@ts-ignore
                    return logical(node.left, store, name);
                }
                //@ts-ignore
                return loadExpressions(node.left, store);
            }
            function build(props, fixer, node) {
                fixTracker.push(node.loc.start.line);
                return props.map(prop => {
                    const { props: { range, useRange, node, text } } = prop;
                    const insider = useRange ? range : node;
                    //@ts-ignore
                    return fixer[prop.method](insider, text);
                });
            }
            function report(node, props, context) {
                context.report({
                    message: 'Create global flow',
                    node: node,
                    fix: (fixer) => build(props, fixer, node)
                });
            }
            return {
                ExpressionStatement(node) {
                    if (fixTracker.includes(node.loc.start.line))
                        return;
                    if (node.parent.type !== 'Program')
                        return;
                    let refracted;
                    switch (node.expression.type) {
                        default:
                            refracted = loadExpressions(node.expression);
                            break;
                    }
                    report(node, refracted, context);
                }
            };
        },
    });
    const msg = linter.verifyAndFix(source, {
        parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, rules: {
            'code-checker': 'error',
        }
    });
    return msg;
}
exports.expressionLinter = expressionLinter;
