"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeBase = void 0;
const utilities_1 = require("@timeax/utilities");
const __1 = require("..");
const jse_1 = require("../../../components/jse");
const parser_1 = __importDefault(require("../../../components/util/parser"));
class AttributeBase extends __1.BaseNode {
    constructor(props) {
        super(props);
        this.raw = null;
        this.type = 'Attributes';
        this.started = false;
        this.temp = '';
        this.isBlock = true;
        this.caller = props;
    }
    init() {
        this.quotes = { type: '', count: 0, uses: false };
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (typeof value == 'string')
            return;
        value.sourceParent = this.caller.sourceParent;
        value.loc.path = value.sourceParent.path;
        value.close = this.close;
        value.isUseless = true;
    }
    get char() {
        return this._char;
    }
    set char(value) {
        this._char = value;
        if (!this.started) {
            if (!parser_1.default.isWN(value) || parser_1.default.isQuote(value)) {
                this.started = true;
                this.temp += value;
                if (parser_1.default.isQuote(value)) {
                    this.quotes.type = value;
                    this.quotes.count = 1;
                    this.quotes.uses = true;
                    this.temp = '';
                    this.valueType = 'string';
                }
                else if (value === '{') {
                    if ((0, utilities_1.is)(this.prev).null) {
                        this.started = false;
                        this.prev = value;
                    }
                    else if (this.prev == value) {
                        this.started = true;
                        this.prev = '';
                        this.temp = '';
                        this.valueType = 'JsE';
                        //@ts-ignore
                        this.value = new jse_1.JsE(this.caller.sourceParent.trim);
                    }
                }
                else
                    this.valueType = 'string';
            }
            return;
        }
        //
        if (this.valueType == 'JsE' && this.value.type === 'JsE')
            this.setJsValue(value);
        else if (this.quotes.uses)
            this.setString(value);
        else
            this.setString(value, true);
        this.prev = value;
    }
    setJsValue(value) {
        //@ts-ignore
        const { value: current } = this;
        if (value === '{')
            this.store++;
        if (value === '}')
            this.store--;
        if (value == '}' && this.store > 0)
            current.value += value;
        else if (value === '}' && current.temp === '}') {
            let value = current.value;
            let text = '=======dfjicsfw-dvgdsfm0d-f,df,';
            const match = value.match(/@\w+/g);
            if (!(0, utilities_1.is)(match).null)
                text = match[0];
            if (value.trim().startsWith(text))
                throw 'Argument must be an expression';
            current.isClosed = true;
            this.closed = true;
        }
        else if (value == '}')
            current.temp = value;
        else
            current.value += value, current.temp = '';
    }
    setString(value, skip = false) {
        if (parser_1.default.isQuote(value) && !skip) {
            if (this.quotes.type === value && this.quotes.count == 1 && this.quotes.uses) {
                this.quotes.count++;
                //@ts-ignore
                this.value = this.temp;
                //@ts-ignore
                this.compiledValue = this.value;
                this.closed = true;
                return;
            }
            else
                this.temp += value;
        }
        else {
            const valid = parser_1.default.isQuote(value) || value === '`';
            //---
            if (this.quotes.uses)
                return this.temp += value;
            ///----
            if (parser_1.default.isWN(value) || valid) {
                //@ts-ignore
                this.value = this.temp;
                //@ts-ignore
                this.compiledValue = this.value;
                this.closed = true;
                if (!parser_1.default.isWN(value))
                    this.caller.caller.parseHTML(value);
            }
        }
        this.temp += value;
    }
    set sourceChange(value) {
        this.sourceParent = value;
        if (this.value.type === 'JsE')
            this.name.sourceChange = value, this.value.sourceChange = value;
    }
    close() { }
    get closed() {
        return super.closed;
    }
    set closed(value) {
        super.closed = value;
        //@ts-ignore
        if (value)
            this.caller.attr = null, this.caller.nameMap = null;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        super.isClosed = value;
    }
}
exports.AttributeBase = AttributeBase;
