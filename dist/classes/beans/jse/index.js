"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsEBase = void 0;
const linter_1 = __importDefault(require("../../util/linter"));
const element_1 = require("../element");
class JsEBase extends element_1.Element {
    constructor(props) {
        super(props);
        this.preserveText = false;
        this.sourceType = 'expression';
        this.value = '';
        this.compileId = 0;
        this.type = 'JsE';
        this.raw = null;
        this.isBlock = false;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        if (value && this.isClosed)
            return;
        if (value) {
            if (this.sourceType === 'expression') {
                if (this.value.startsWith('{') && this.value.endsWith('}'))
                    this.value = `props.${this.value.match(/\w+/g)}`;
                this.lint();
            }
            else if (this.errorCheck(value))
                value = true;
        }
        super.isClosed = value;
    }
    errorCheck(value) {
        if (value && linter_1.default.lintText(this.value))
            return value;
    }
    lint() {
        const output = linter_1.default.jsxLinter(this.value);
        const msg = linter_1.default.parseExpression(output.verify());
        if (!msg.fixed && msg.messages.length > 0) {
            console.log(msg.messages);
            throw 'Errow linting code at line ' + this.loc.start.line;
        }
        this.value = msg.output;
    }
    parseScript() {
        const script = linter_1.default.parseJsE(this.value, this.sourceParent.scriptEngine.env).verify();
        let code = '';
        const { env, names, out } = linter_1.default.parseScript(script, {
            env: this.sourceParent.scriptEngine.env,
            useImports: false, id: this.sourceParent.scriptEngine.compileId
        });
        if (names.length !== 0) {
            this.sourceParent.scriptEngine.env = env;
            const [a, b] = ['{', '}'];
            let format = 'return {a} {code} {b};';
            //@ts-ignore
            code = format.format({ a: a, b: b, code: names.join(', ') });
        }
        return out + '\n' + code;
    }
}
exports.JsEBase = JsEBase;
