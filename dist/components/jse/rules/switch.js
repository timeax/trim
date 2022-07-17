"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const extract_1 = require("../../../classes/util/extract");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
class Switch extends _1.Compiler {
    constructor(props) {
        super(props);
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        if (this.rule.name !== 'default') {
            if (params.length > 1 || params.length < 1)
                this.throw(`Expected 1 parameter but found ${params.length}`);
            const extract = linter_1.default.extractExpression(params[0])[0];
            if (extract.type == 'Literal' && this.rule.name === 'switch')
                this.throw('Expected a variable but found Literal', 'TypeError');
            this.temp = params[0];
        }
        //------
        if (this.rule.name === 'switch')
            this.rule.childTest = function (value) {
                //
                const validate = (name) => name == 'case' || name == 'default';
                //---
                let err = `Expected '{@case ...}' in {@switch}, found ${value.loc.source}`;
                const obj = { msg: 'success', valid: true };
                if (value.type === 'TextNode') {
                    obj.msg = err;
                    obj.valid = false;
                    if ((0, utilities_1.isEmpty)(value.value))
                        obj.msg = 'ignore', obj.valid = true;
                }
                else if (value.type !== 'JsRule' || !validate(value.name))
                    obj.msg = err, obj.valid = false;
                return obj;
            };
    }
    compile() {
        const { rule: { self, name, children } } = this;
        //@ts-ignore
        let _case = { compile: () => '' };
        //---
        if (name === 'switch') {
            this.value = linter_1.default.parseExpression(this.temp, Object.keys(self.sourceParent.globals)).output;
            const condition = (0, extract_1._call)(self.sourceParent.globals, this.value);
            //---
            const validCase = children.find(item => {
                if (item.name !== 'case')
                    return;
                let valid = false;
                item.compiler.value = linter_1.default.parseExpression(item.compiler.temp, Object.keys(self.sourceParent.globals)).output;
                //----
                for (let word of this.split(item.compiler.value)) {
                    const test = (0, extract_1._call)(item.sourceParent.globals, word);
                    if (test !== condition)
                        continue;
                    valid = true;
                    break;
                }
                return valid;
            });
            if (validCase)
                _case = validCase;
            else {
                const def = children.find(item => item.name === 'default');
                if (def)
                    _case = def;
            }
        }
        else
            return children.map(item => item.compile()).join('');
        return _case.compile();
    }
    split(text) {
        const store = [];
        const quotes = ['"', "'"];
        let word = '';
        let lookout = false;
        let isQuote = false;
        for (let index = 0; index < text.length; index++) {
            const char = text.charAt(index);
            if (isQuote) {
                word += char;
                if (quotes.includes(char)) {
                    isQuote = false;
                }
            }
            else {
                if (quotes.includes(char)) {
                    word += char;
                    isQuote = true;
                }
                else {
                    if (char === '|') {
                        if (lookout) {
                            store.push(word.trim());
                            word = '';
                            lookout = false;
                        }
                        else
                            lookout = true;
                    }
                    else
                        word += char;
                }
            }
            if (index === text.length - 1)
                store.push(word.trim());
        }
        return store.filter(item => !(0, utilities_1.isEmpty)(item));
    }
}
exports.default = Switch;
