"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptEngine = void 0;
const linter_1 = __importDefault(require("../../util/linter"));
const element_1 = require("../element");
const string_format_1 = __importDefault(require("string-format"));
const extract_1 = require("../../util/extract");
const utilities_1 = require("@timeax/utilities");
string_format_1.default.extend(String.prototype, {});
class ScriptEngine extends element_1.Element {
    constructor(props) {
        super(props);
        this.name = 'ScriptEngine';
        this.value = '';
        this.type = 'Script';
        this.names = [];
        this.compileId = 0;
        this._script = '';
        this._env = [{ id: 'constant', name: 'props', type: 'const' }];
        this.isSet = true;
    }
    get script() {
        return this._script;
    }
    set script(value) {
        this._script = value;
    }
    //@ts-ignore
    get env() {
        return this._env;
    }
    set env(value) {
        if (Array.isArray(value))
            value.forEach(item => this.env = item);
        else {
            value.names.forEach(name => {
                const index = this.env.findIndex(item => item.name === name);
                if (index === -1)
                    this.env.push({ id: this.compileId, name: name, type: this.getType(value.type) });
                else {
                    const env = this.env[index];
                    if (env.id === this.compileId) {
                        if (!(env.type === 'var' && value.type === 'var'))
                            throw Error(`Varible '${env.name}' already in use...`);
                    }
                    else {
                        this.env[index] = { id: this.compileId, name: name, type: this.getType(value.type) };
                    }
                }
            });
        }
    }
    set __env(env) {
        if (Array.isArray(env))
            env.forEach(item => this.__env = item);
        else {
            const name = env.name;
            if (name === 'props')
                return;
            const index = this.env.findIndex(item => item.name === name);
            if (index === -1)
                this.env.push({ id: this.compileId, name: name, type: this.getType(env.type), value: env.value });
            else {
                const _env = this.env[index];
                if (_env.id === env.id) {
                    if (!(env.type === 'var' && env.type === 'var'))
                        throw `Variable '${env.name}' already in use...`;
                }
                else {
                    this.env[index] = { id: this.compileId, name: name, type: this.getType(env.type), value: env.value };
                }
            }
        }
    }
    set reset(value) {
        if (value) {
            this.script = '';
            this.value = '';
            this._env = [];
            this.compileId = 0;
        }
    }
    lint() {
        const { env, names, out } = linter_1.default.parseScript(this.value, { env: this.env, useImports: true, id: this.compileId });
        this.names = names;
        //@ts-ignore
        this.env = env;
        this.script = out;
    }
    compile() {
        this.lint();
        const script = this.script + '\n' + this.exportText;
        (0, extract_1.extractVars)(script, ({ value, key }) => {
            const obj = this.env.find(item => item.name === key);
            if ((0, utilities_1.is)(obj).notNull) {
                obj.value = value;
            }
        });
        this.compileId++;
        return '';
    }
    get exportText() {
        if (this.names.length == 0)
            return '';
        const [a, b] = ['{', '}'];
        let code = 'return {a} {code} {b};';
        //@ts-ignore
        return code.format({ a: a, b: b, code: this.names.join(', ') });
    }
    getType(type) {
        let result = null;
        switch (type) {
            case 'const':
            case 'function':
            case 'class':
                result = 'const';
                break;
            default:
                result = type;
                break;
        }
        return result;
    }
}
exports.ScriptEngine = ScriptEngine;
