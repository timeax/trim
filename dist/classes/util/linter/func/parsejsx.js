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
const utilities_1 = require("@timeax/utilities");
const eslint_1 = require("eslint");
const __1 = __importStar(require(".."));
const trim_lint_1 = require("trim-lint");
function parseJsx(src, linter = new eslint_1.Linter(), options) {
    const tracker = [];
    let store = [];
    let fixTracker = [];
    let assets = [];
    linter.defineParser('trim-lint-parser', {
        parse(text, options) {
            return (0, trim_lint_1.parse)(text, options);
        },
    });
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
            function getBLock(node) {
                let parent = node.parent;
                if (parent) {
                    if (parent.type === 'BlockStatement' || parent.type === 'Program')
                        return parent;
                    else
                        parent = getBLock(parent);
                }
                return parent;
            }
            function concat(old, array) {
                const store = array.filter(item => !old.includes(item));
                old = [...old, ...store];
                return old;
            }
            function climbLadder(node, store, ignore = false) {
                const obj = tracker.find(item => item.node === node);
                if ((0, utilities_1.is)(obj).null) {
                    let source = context.getSourceCode().getText(node).trim();
                    if (!ignore) {
                        const names = getNames(source);
                        store = concat(store, names);
                        if (node.type == 'BlockStatement') {
                            //@ts-ignore
                            const params = loadParams(node);
                            store = concat(store, params);
                        }
                    }
                    //###
                    let cart = [];
                    //--
                    const parent = getBLock(node);
                    if ((0, utilities_1.is)(parent).null)
                        return store;
                    //---
                    let ladder = climbLadder(parent, []);
                    //---
                    cart = concat(cart, ladder);
                    store = concat(store, ladder);
                    //-
                    const match = tracker.find(item => item.node === parent);
                    //-
                    if ((0, utilities_1.is)(match).null) {
                        const obj = { node: parent, names: cart, isSet: false };
                        tracker.push(obj);
                    }
                }
                else
                    store = concat(store, obj.names);
                return store;
            }
            function getNames(src) {
                return extractNames(src, null, utilities_1.Fs.ext(options.path)).verify();
            }
            function createGlobals(names) {
                const format = (props) => {
                    if (utilities_1.Fs.ext(options.path) === '.htm') {
                        if (props.startsWith('$')) {
                            const real = props.substring(1, props.length);
                            props = `global.__GLOBAL__.${real}`;
                        }
                    }
                    return props;
                };
                return `const globals = {${names.map(name => `${name}: global.avoid(() => ${format(name)})`).join(', ')}};`;
            }
            function build(globals) {
                const index = global.jsImports.findIndex(item => item.path === options.path);
                if (index !== -1) {
                    const obj = global.jsImports[index];
                    obj.imports = assets;
                }
                else
                    global.jsImports.push({ path: options.path, imports: assets });
                return (`function __$_extract(src, path, imports) {
                        const mapper = new (global.nodeMapper)();
                        ${globals}
                        mapper.run(src, 'ElementMap', path);
                        mapper.__globals = globals; 
                        if(!global.is(imports).null) {
                            const imports = global.Exports.find(item => global.Fs.samePath(item.path, mapper.path));
                        } else mapper.imports = global.jsImports.find(item => global.Fs.samePath(item.path, mapper.path)).imports;
                        return mapper.compile();
                    }`).replace(/\r?(\n|\r)/g, '');
            }
            function buildFix(props, fixer, node) {
                fixTracker.push(node.loc.start.line);
                return props.map(prop => {
                    const { props: { range, useRange, node, text } } = prop;
                    const insider = useRange ? range : node;
                    //@ts-ignore
                    return fixer[prop.method](insider, text);
                });
            }
            function reportFix(node, props, context) {
                context.report({
                    message: 'Create global flow',
                    node: node,
                    fix: (fixer) => buildFix(props, fixer, node)
                });
            }
            function getText(node) {
                return context.getSourceCode().getText(node);
            }
            function getName(node, store = []) {
                let name = null;
                switch (node.type) {
                    case 'Identifier':
                        store = concat(store, [node.name]);
                        break;
                    case 'AssignmentPattern':
                        store = getName(node.left, store);
                        break;
                    case 'RestElement':
                        store = getName(node.argument, store);
                        break;
                    case 'ArrayPattern':
                        node.elements.forEach(item => store = getName(item, store));
                        break;
                    case 'ObjectPattern':
                        //@ts-ignore
                        node.properties.forEach(item => store = getName(item, store));
                        break;
                }
                return store;
            }
            function strip(node, store = []) {
                node.declarations.forEach(item => store = concat(store, getName(item.id)));
                return store;
            }
            function loadParams(node) {
                let names = [];
                switch (node.parent.type) {
                    case 'ArrowFunctionExpression':
                    case 'FunctionDeclaration':
                    case 'FunctionExpression':
                        node.parent.params.forEach(param => names = concat(names, getName(param)));
                        break;
                    case 'ForInStatement':
                    case 'ForOfStatement':
                        if (node.parent.left.type === 'VariableDeclaration')
                            names = concat(names, strip(node.parent.left));
                        break;
                    case 'ForStatement':
                        if (node.parent.init.type === 'VariableDeclaration')
                            names = concat(names, strip(node.parent.init));
                        break;
                    case 'CatchClause':
                        names = concat(names, getName(node.parent.param));
                        break;
                }
                return names;
            }
            return {
                JSXElement(node) {
                    let source = context.getSourceCode().getText(node);
                    // console.log(source)
                    let fix = `'-jsx-code- ${source}\'`;
                    let fixes = [];
                    //--
                    if ((0, utilities_1.is)(options.path).notNull) {
                        if (options.wrapper === 'func') {
                            //---------------
                            const parent = getBLock(node);
                            let params = [];
                            //----------
                            if (parent.type === 'BlockStatement' || parent.type === 'Program') {
                                const obj = tracker.find(item => item.node === parent);
                                if ((0, utilities_1.is)(obj).null) {
                                    //@ts-ignore
                                    if (parent.type === 'BlockStatement')
                                        params = loadParams(parent);
                                    let source = context.getSourceCode().getText(parent).trim();
                                    const vars = getNames(source);
                                    //>
                                    const names = concat(params, climbLadder(parent, vars, true));
                                    const obj = { node: parent, names: names, isSet: true };
                                    //>
                                    const globals = createGlobals(obj.names);
                                    tracker.push(obj);
                                    fixes.push({
                                        method: 'insertTextBefore',
                                        props: {
                                            text: build(globals),
                                            useRange: false,
                                            node: parent.body[0]
                                        }
                                    });
                                }
                                else {
                                    if (!obj.isSet) {
                                        const globals = createGlobals(obj.names);
                                        fixes.push({
                                            method: 'insertTextBefore',
                                            props: {
                                                text: build(globals),
                                                useRange: false,
                                                node: parent.body[0]
                                            }
                                        });
                                        obj.isSet = true;
                                    }
                                }
                            }
                            const components = utilities_1.Fs.ext(options.path) === '.js' ? null : options.imports;
                            //---## add the callFuntion fix
                            fixes.push({
                                method: 'replaceText',
                                props: {
                                    text: `__$_extract('${source}', '${options.path}', ${JSON.stringify(components)})`,
                                    useRange: false,
                                    node: node
                                }
                            });
                            //------------
                        }
                        else
                            fixes.push({
                                method: 'replaceText',
                                props: {
                                    text: fix,
                                    useRange: false,
                                    node: node
                                }
                            });
                    }
                    reportFix(node, fixes, context);
                },
                ExpressionStatement(node) {
                    if (node.parent.type !== 'Program')
                        return;
                    if (node.expression.type !== 'TemplateLiteral')
                        return;
                    if (node.parent.body[0] !== node)
                        return;
                    //-----
                    const mapper = new global.nodeMapper();
                    const source = getText(node);
                    mapper.run(source.substring(1, source.length - 1), 'ElementMap', options.path);
                    assets = mapper.imports.filter(item => item.sourceType === 'Export');
                },
            };
        }
    });
    return {
        verify() {
            let msg = linter.verifyAndFix(src, {
                rules: {
                    'jsx-parser': 'error',
                },
                parser: 'trim-lint-parser',
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
                throw new __1.CustomError(`${msg.messages.map(ms => {
                    return `${ms.message}... \n   at ${ms.line}:${ms.column}`;
                }).join('\n')} \n    sourceCode: ${src}`, '');
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
function extractNames(src, stopper = null, ext = '.js', linter = new __1.default().linter) {
    const hasStopper = !(0, utilities_1.is)(stopper).null;
    const names = [];
    const fixTracker = [];
    //---
    linter.defineRule('names-extractor', {
        meta: {
            type: 'problem',
            fixable: 'whitespace',
            docs: {
                description: 'Extract all global variables.',
                category: 'Possible Errors'
            },
            schema: [],
        },
        create: (context) => {
            function loadIds(item) {
                switch (item.type) {
                    case 'ArrayPattern':
                        item.elements.forEach(node => {
                            loadIds(node);
                        });
                        break;
                    case 'Identifier':
                        names.push(item.name);
                        break;
                    case 'ObjectPattern':
                        item.properties.forEach(prop => {
                            loadprop(prop);
                        });
                        break;
                    case 'RestElement':
                        loadIds(item.argument);
                        break;
                }
            }
            function loadprop(prop) {
                if (prop.type == 'Property')
                    return loadIds(prop.value);
                else
                    return loadIds(prop);
            }
            function valid(node) {
                let valid = false;
                if (node.parent.type == 'Program')
                    valid = true;
                else if (node.parent.type === 'BlockStatement' && node.parent.parent.type === 'Program')
                    valid = true;
                return valid;
            }
            return {
                VariableDeclaration(node) {
                    if (!valid(node))
                        return;
                    if (hasStopper && stopper === node)
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    //@ts-ignore
                    node.declarations.forEach(item => loadIds(item.id));
                    fixTracker.push(source);
                },
                FunctionDeclaration(node) {
                    if (!valid(node))
                        return;
                    if (hasStopper && stopper === node)
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    loadIds(node.id);
                    fixTracker.push(source);
                },
                ClassDeclaration(node) {
                    if (!valid(node))
                        return;
                    if (hasStopper && stopper === node)
                        return;
                    const source = context.getSourceCode().getText(node);
                    if (fixTracker.includes(source))
                        return;
                    loadIds(node.id);
                    fixTracker.push(source);
                }
            };
        }
    });
    return {
        verify() {
            let msg = linter.verify(src, {
                rules: {
                    'names-extractor': 'error',
                },
                parser: 'trim-lint-parser',
                env: { es6: true },
                parserOptions: {
                    ecmaVersion: 'latest',
                    sourceType: 'script',
                    ecmaFeatures: {
                        jsx: true,
                        globalReturn: true
                    },
                },
            });
            const messages = msg.filter(item => (item.fatal == true || item.severity) && item.ruleId == 'names-extractor');
            if (messages.length > 0)
                throw new __1.CustomError(`${messages.map(ms => {
                    return `${ms.message}... \n   at ${ms.line}:${ms.column}`;
                }).join('\n')} \n   sourceCode: ${src}`, '');
            ;
            // console.log(names);
            return names;
        }
    };
}
