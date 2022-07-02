"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML = void 0;
const utilities_1 = require("@timeax/utilities");
const nodemap_1 = require("../programs/nodemap");
const parser_1 = __importDefault(require("../util/parser"));
const index_1 = require("./../../classes/beans/html/index");
const attr_1 = require("./attr");
class HTML extends index_1.HTMLBase {
    constructor(props) {
        super(props);
        this.isSet = true;
    }
    get nameMap() {
        return this._nameMap;
    }
    set nameMap(value) {
        if ((0, utilities_1.is)(this.nameMap).null || (0, utilities_1.is)(value).null)
            this._nameMap = value, value ? value.nodeType = 'NameMap' : '';
    }
    parseAttr(char) {
        this.loc.source += char;
        if ((0, utilities_1.is)(this.attr).null) {
            if (char === '/') {
                this.lookup = true;
                this.words += char;
            }
            if (this.closing(char))
                return;
            this.nameMap = new nodemap_1.Nodemap(this.sourceParent);
            if (this.nameMap.trim.current.type == null || this.nameMap.trim.current.type == 'TextNode') {
                if (char === '=')
                    this.nameMap.closed = true;
            }
            const stop = this.nameMap.closed ? true : this.nameMap.run(char, 'NameMap');
            if (stop) {
                this.nameMap.trim.haltProgram();
                this.attr = new attr_1.Attributes(this);
                this.attr.name = this.nameMap;
                if (char === '=')
                    this.attr.isClosed = true;
            }
        }
        else {
            const close = (prop, rerun = false, letter = char) => {
                this.attr[prop] = true;
                console.log('prop ->', prop);
                if (rerun)
                    this.caller.parseHTML(letter);
            };
            if (this.closing(char))
                return;
            if (this.attr.isClosed)
                this.attr.char = char;
            else {
                if (char === '=')
                    close('isClosed');
                else if (parser_1.default.isWord(char))
                    close('closed', true, char);
                else if (parser_1.default.isWN(char))
                    return;
                else if (char.startsWith('{'))
                    close('closed', true, char);
            }
        }
    }
    compile() {
        this.clear = true;
        if (this.htmlType == 'Custom')
            this.customLoader();
        else if (this.htmlType == 'Component')
            this.componentLoader();
        else
            this.domLoader();
        return this.compiledText;
    }
    customLoader() {
        throw new Error('Method not implemented.');
    }
    componentLoader() {
        //@ts-ignore
        const exp = this.sourceParent.imports.filter(item => item.sourceType === 'Export');
        const component = exp === null || exp === void 0 ? void 0 : exp.find(item => item.ref === this.name);
        if ((0, utilities_1.is)(component).null)
            throw `Counld not find component with name '${this.name}'`;
        if (component.exportType == 'normal') {
            this.attributes.forEach(item => item.compile());
            component.props = this.attributes;
            component.props['children'] = this.children;
            this.compiledText = component.compile();
        }
    }
    domLoader() {
        this.compiledText = (this.attributes.length > 0) ?
            `<${this.name} ${this.attributes.map(item => item.compile()).join(' ')}>` :
            `<${this.name}>`;
        if (this.isBlock)
            this.compiledText = `${this.children.map(item => item.compile()).join('')}</${this.name}>`;
    }
}
exports.HTML = HTML;
