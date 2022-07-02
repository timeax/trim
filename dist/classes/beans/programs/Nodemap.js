"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemapBase = void 0;
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const __1 = require("../../..");
const parser_1 = __importDefault(require("../../../components/util/parser"));
class NodemapBase extends _1.Program {
    constructor(parent = null, props = new __1.Trim()) {
        super(props);
        this.nodeType = 'ElementMap';
        this.sourceType = 'NodeMap';
        this.setParsers(props);
    }
    setParsers(trim) {
        if (this.nodeType === 'NameMap')
            trim.parseText = this.parseText;
    }
    //@ts-ignore
    get body() {
        //@ts-ignore
        return super.body;
    }
    //@ts-ignore
    set body(value) {
        if (value.type === 'Script')
            throw 'Scripts are not allowd in nodemaps';
        if (this.nodeType === 'NameMap') {
            if (value.type == 'TextNode' || value.type == 'JsE') {
                if (value.type == 'JsE')
                    if (value.sourceType == 'script')
                        throw 'Unwanted tag in NameMap-nodemap';
            }
            else
                throw 'unwanted tag in namemap';
        }
        //@ts-ignore
        super.body = value;
    }
    handle(char, prevChar = '') {
        const { builder, current } = this.trim;
        let newline = char == null ? false : parser_1.default.isNl(char);
        let whitespace = char == null ? false : parser_1.default.isWs(char);
        let charTrack = char == null && true;
        prevChar = (0, utilities_1.isEmpty)(prevChar) ? '' : prevChar;
        let text = char == null ? '' : char;
        //=== textnodes close
        if (current.type == 'TextNode' && charTrack) {
            text = current.temp + prevChar;
            current.stop = true;
            current.isClosed = true;
        }
        if (!this.isValid(char))
            return;
        //--------- line and column increments ------------------
        if (!charTrack)
            (this.trim.column++, builder.build += char);
        if ((newline || whitespace) && (current.type === 'TextNode'))
            return (this.closed = true);
        //-------------------
        // compile current 
        if (!this.trim.parseCurrent(text))
            return;
        // ---##
        if (this.trim.justClosed)
            return (this.trim.justClosed = false);
        //-----------------
        builder.text += text;
        //=== is closing html tag
        if (this.trim.htmlClose(text))
            return;
        //----------------
        if (this.trim.justClosed)
            return (this.trim.justClosed = false);
        //===============
        this.trim.charTracker(char);
        //---------------
        // character parser
        this.trim.parseChar(char);
        ////////////////////////
        if (newline || whitespace || charTrack) {
            builder.clearText();
            // parse new word
            const type = parser_1.default.parse(builder.word);
            const objType = this.trim.classes.find(obj => obj.name === type).type;
            const call = () => {
                this.trim.store = 0;
                //@ts-ignore
                const obj = new objType(this.trim);
                if (obj.type === 'JsE') {
                    if (builder.word === '{%')
                        throw 'JsScripts cannot exist in Namemaps';
                }
                if ((0, utilities_1.is)(this.trim.opened).emptyArray)
                    this.trim.current = obj;
                else
                    throw `Nested tags are forbidden in a Nodemap component`;
            };
            if (type !== 'TextNode') {
                if (current.type === 'TextNode')
                    if (!current.closed)
                        current.isClosed = true;
                call();
            }
            else {
                if ((0, utilities_1.is)(this.trim.current).null) {
                    if (!(0, utilities_1.isEmpty)(builder.word))
                        call();
                }
                else
                    call();
            }
        }
    }
    isValid(char) {
        if (char == null)
            return true;
        if ((0, utilities_1.isEmpty)(char) && this.body.length == 0)
            return false;
        else {
        }
        return true;
    }
    parseText(char) {
        const { self, current, isHTML: html, builder } = this;
        if (current.type == 'TextNode') {
            self.charTracker(char);
            self.parseChar(char);
            if (self.lookout)
                current.temp += char;
            if (html) {
                self.htmlClose(char);
                return false;
            }
            const call = (char, word = null) => {
                if (char === '=') {
                    if (!(0, utilities_1.is)(word).null)
                        current.value = word;
                    self.component.closed = true;
                    return true;
                }
                return false;
            };
            let { word } = builder;
            if (current.firstRun) {
                if (self.component.body[0] === current) {
                    if (word.startsWith('='))
                        throw 'Cannot start namemap with "="';
                    else if (call(word))
                        return;
                }
                else if (call(word))
                    return;
                if (current.temp.length > 1 || current.temp.length < 1)
                    word += char, current.temp == '';
                current.value += word;
                current.firstRun = false;
            }
            else {
                if (call(char))
                    return;
                if (current.stop) {
                    const text = current.temp + char;
                    if (current.value.endsWith(text))
                        current.value = current.value.substring(0, (current.value.length - text.length));
                }
                else {
                    if (!self.lookout)
                        current.value += current.temp + char;
                }
                if (current.temp.length > 1)
                    current.temp = '';
            }
        }
    }
}
exports.NodemapBase = NodemapBase;
