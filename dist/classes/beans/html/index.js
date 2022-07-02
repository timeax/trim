"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLBase = void 0;
const utilities_1 = require("@timeax/utilities");
const dom_config_json_1 = __importDefault(require("../../../conf/rules/dom.config.json"));
const element_1 = require("../element");
class HTMLBase extends element_1.Parent {
    constructor(props) {
        super(props);
        this.type = 'HTML';
        this.lookup = false;
        this.words = '';
        this._attributes = [];
        this.htmlType = 'DOMElement';
    }
    get name() {
        return this._name;
    }
    set name(value) {
        const first = value.charAt(0);
        if ((0, utilities_1.is)(first).isCap()) {
            this.isBlock = true;
            this.htmlType = 'Component';
        }
        else {
            const config = dom_config_json_1.default.find(item => item.name === value);
            if ((0, utilities_1.is)(config).notNull) {
                this.isBlock = config.isBlock;
                this.htmlType = 'Custom';
                this.config = config;
            }
            else
                this.isBlock = (0, utilities_1.is)(value).blockElement();
        }
        if (value === 'pre')
            this.preserveText = true;
        this._name = value;
    }
    get attributes() {
        return this._attributes;
    }
    set attributes(value) {
        if ((0, utilities_1.is)(value).notNull) {
            if (Array.isArray(value))
                this._attributes = value;
            else
                this._attributes.push(value);
        }
    }
    get attr() {
        return this._attr;
    }
    set attr(value) {
        this._attr = value;
        if ((0, utilities_1.is)(value).notNull)
            this.attributes = value;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
        if ((0, utilities_1.is)(this.config).notNull) {
            this.resolvePath();
        }
    }
    set sourceChange(value) {
        super.sourceChange = value;
        if (this.attributes.length > 0)
            this.attributes.forEach(item => item.sourceChange = value);
    }
    resolvePath() {
        let path = utilities_1.Fs.join(__dirname, this.config.path);
        const obj = this;
        if ((0, utilities_1.isEmpty)(utilities_1.Fs.ext(path)))
            path = `${path}.js`;
        if (utilities_1.Fs.exists(this.config.path))
            call(this.config.path);
        else if (utilities_1.Fs.exists(path))
            call(path);
        else
            throw 'File not found';
        function call(link) {
            const compiler = new (require(link).default)(obj);
            obj.compiler = compiler;
        }
    }
    parseAttr(char) {
        throw new Error("Method not implemented.");
    }
    closing(char) {
        let res = false;
        if (char == '>') {
            if (this.attr) {
                if (!this.attr.quotes.uses && !(this.attr.valueType === 'JsE')) {
                    if (this.attr.valueType == 'string') {
                        if ((0, utilities_1.isEmpty)(this.attr.temp))
                            throw 'Please close attribute';
                        //@ts-ignore
                        else
                            this.attr.value = this.attr.temp;
                    }
                    res = true;
                    this.end();
                }
            }
            else
                this.end(), res = true;
        }
        if (this.words.length === 2)
            this.words = '', this.lookup = false;
        return res;
    }
    end() {
        this.caller.justClosed = true;
        if (this.lookup)
            this.closed = true;
        else
            this.isClosed = true;
        this.lookup = false;
    }
}
exports.HTMLBase = HTMLBase;
