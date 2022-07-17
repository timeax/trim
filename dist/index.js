"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trim = void 0;
const utilities_1 = require("@timeax/utilities");
const classes_1 = require("./classes");
const parser_1 = __importDefault(require("./components/util/parser"));
class Trim extends classes_1.TrimBaseClass {
    constructor(props) {
        super(props);
        this.isSet = true;
    }
    run(path, variables = { globals: { props: {} }, props: {}, sourceParent: null }, callback = () => this.finish(), component = null) {
        this.setup(component, path, variables);
        this.path = path;
        this.start(path, callback);
    }
    nodemap(program, text, path) {
        if ((0, utilities_1.is)(text).null)
            throw 'Text cannot be null';
        this.path = path;
        this.component = program;
        this.start(text, () => this.finish());
    }
    programRun(program, text, path = null) {
        if ((0, utilities_1.is)(path).null)
            path = text;
        this.path = path;
        this.component = program;
        this.start(text, () => this.finish());
    }
    continue(path) {
        this.currentPath = path;
        this.start(path, () => this.finish());
    }
    rerun(callback = () => this.finish(), path = this.component.path) {
        this.reset = true;
        this.component.reset = true;
        this.start(path, callback);
    }
    finish() {
        super.finish();
        this.component.closed = true;
    }
    start(path, callback) {
        // Exception.type = 'RUNTIME';
        utilities_1.Fs.readChar2(path, (char) => this.handle(char), () => callback());
    }
    parseCurrent(char) {
        if ((0, utilities_1.is)(this.current.type).null)
            return true;
        if (this.current.isClosed)
            return true;
        this.parseComment(char);
        this.parseJsE(char);
        this.parseJsRule(char);
        this.parseScript(char);
        this.parseHTML(char);
        this.parseText(char);
        if ((0, utilities_1.is)(this.current).null)
            return true;
        return this.current.isClosed;
    }
    parseComment(char) {
        const { current } = this;
        if (current.type === 'Comment') {
            if (current.commentType == 'inline') {
                if (current.closeComment) {
                    current.closed = true;
                    this.justClosed = true;
                    return;
                }
                current.loc.source += char;
                current.value += char;
                return;
            }
            if (char === '*')
                current.temp += char;
            else {
                if (current.temp === '*') {
                    if (char == '/') {
                        current.closed = true;
                        current.loc.end = { line: this.line, column: this.column };
                        current.loc.source += `${current.value}*/`;
                        this.justClosed = true;
                    }
                }
                else
                    current.value += char;
            }
        }
    }
    parseJsE(char) {
        let { store, current } = this;
        if (current.type == 'JsE') {
            const ref = current.sourceType == 'script' ? '%' : '}';
            //----
            if (ref === '%')
                this.parseJsS(char, current);
            else {
                if (char === '{')
                    this.store++;
                if (char == '}')
                    this.store--;
                if (char == '}' && store > 0)
                    current.value += char;
                else if (char == '}' && current.temp == ref)
                    current.isClosed = true, this.justClosed = true;
                else if (char === ref)
                    current.temp += char;
                else
                    current.value += char;
            }
        }
    }
    parseJsRule(char, current = this.current) {
        const set = (current) => {
            current.name = current.temp;
            current.temp = '';
            current.firstRun = false;
            current.parent = this.parent;
            this.opened.push(current);
        };
        //----
        if (current.type === 'JsRule') {
            if (current.firstRun) {
                this.store = 1;
                if (parser_1.default.isWord(char))
                    current.temp += char;
                else {
                    if (parser_1.default.isWN(char)) {
                        if ((0, utilities_1.isEmpty)(current.temp)) {
                            current.isUseless = true;
                            this.current = this.createElement('TextNode');
                            this.current.loc = current.loc;
                            this.current.parent = this.parent;
                            this.current.value = '{@' + char;
                        }
                        else
                            set(current);
                    }
                    else if (char !== '}')
                        throw 'TypeError at ' + this.line;
                    else
                        set(current), current.isClosed = true, this.justClosed = true;
                }
                return;
            }
            //---
            if (char === '{')
                ++this.store;
            if (char === '}')
                this.store--;
            //---
            if (char == '}' && this.store > 0)
                current.props += char;
            else if (char == '}') {
                current.params = current.props.trim().split(',').filter(item => !(0, utilities_1.isEmpty)(item));
                //@ts-ignore
                current.isClosed = true;
                this.justClosed = true;
            }
            else
                current.props += char;
        }
    }
    parseJsS(char, current) {
        if (char === '%')
            current.temp += char;
        else {
            if (current.temp === '%') {
                if (char == '}') {
                    current.closed = true;
                    current.loc.end = { line: this.line, column: this.column };
                    current.loc.source = `{%${current.value}%}`;
                    this.justClosed = true;
                }
            }
            else
                current.value += char;
        }
    }
    parseScript(char) {
        const { current } = this;
        // ------------
        const clear = (current) => {
            current.value += current.temp + char;
            current.temp = '';
        };
        //------------
        if (current.type == 'Script') {
            const refChar = '%';
            if (char === refChar && (current.value.endsWith(' ') || current.value.endsWith('\n'))) {
                current.temp += char;
            }
            else {
                if (current.temp === refChar) {
                    if (char == '>') {
                        current.isClosed = true;
                        if (current.isClosed) {
                            current.closed = true;
                            this.justClosed = true;
                        }
                        else
                            clear(current);
                    }
                    else
                        clear(current);
                }
                else {
                    current.value += char;
                }
            }
        }
    }
    parseHTML(char) {
        const { current, builder } = this;
        if (current.type === 'HTML') {
            if (current.firstRun) {
                let { word } = builder;
                let pre = char;
                if (char == '/')
                    this.lookout = true, pre = 'testing';
                if (!parser_1.default.isWN(char) && char !== '>') {
                    if (pre.length <= 1)
                        this.lookout = false;
                    current.temp += (() => {
                        let text = word.match(/[^<]+/g)[0];
                        if (!(0, utilities_1.isEmpty)(current.temp))
                            text = '';
                        return text + char;
                    })();
                }
                else {
                    current.name = (0, utilities_1.isEmpty)(current.temp) ? word.match(/[^<]+/g)[0] : current.temp;
                    if (char == '>') {
                        if (this.lookout)
                            current.name = current.name.substring(0, current.name.length - 1), current.closed = true;
                        else
                            current.isClosed = true;
                        this.lookout = false;
                        this.justClosed = true;
                    }
                }
                if (!(0, utilities_1.isEmpty)(current.name))
                    current.firstRun = false;
            }
            else {
                if (!current.isClosed)
                    current.parseAttr(char);
            }
        }
    }
    finaliseNode(char) {
        if (this.isJSE)
            return this.nodeClose(char, 'isJSE');
        else if (this.isHTML)
            return this.nodeClose(char, 'isHTML');
        return false;
    }
    nodeClose(char, FIELD) {
        let ref = FIELD == 'isHTML' ? 'HTML' : 'JsRule';
        const token = FIELD == 'isHTML' ? '>' : '}';
        //--
        const { current } = this;
        let word = '';
        //---
        if (current.compileAsText && current.type !== ref)
            return this[FIELD] = false;
        //--
        const run = (char) => {
            if (char === token) {
                this.word = this.word.substring(0, this.word.length - 1);
                word = this.word;
                this[FIELD] = false;
            }
            return !this[FIELD];
        };
        //----
        const close = (word) => {
            const element = this.find(ref, word);
            if (current.compileAsText) {
                if (current !== element)
                    return this[FIELD] = false, current.value += word;
                current.value = current.value.substring(0, current.value.length - 2);
            }
            if ((0, utilities_1.is)(element).null)
                this.throw(`Could not find ${ref} tag with name; '${word}'
                     at ${ref == 'HTML' ? `</${word}>` : `{/${word}}`}
                     at ${utilities_1.Fs.name(this.currentPath)}:${this.line}`, 'NoMatchFound');
            element.loc.end = { line: this.line, column: this.column };
            this.justClosed = true;
            this.__current = element;
            element.closed = true;
        };
        //-----
        if (this[FIELD]) {
            this.counter++;
            this.word += char;
            if (this.counter === 1) {
                if (char === '>' && ref == 'HTML')
                    this[FIELD] = false, ref = 'Fragment', close('FragmentTag$');
                else if ((0, utilities_1.isEmpty)(this.word))
                    this[FIELD] = false, console.warn(`Suspected ${ref} closing at ${this.line}`);
                else if (!parser_1.default.isWord(char))
                    this[FIELD] = false;
                else {
                    if (current.type === 'TextNode') {
                        let { value } = current;
                        if (value.trim().endsWith('</'))
                            current.value = value.substring(0, value.length - 2);
                        current.isClosed = true;
                        this.word = '';
                    }
                    if (run(char))
                        close(word);
                }
            }
            else if (run(char))
                close(word);
        }
        return this[FIELD];
    }
    parseText(char) {
        const { current, builder, isHTML: html, isJSE } = this;
        if (current.type === 'TextNode') {
            this.charTracker(char);
            this.parseChar(char);
            if (this.lookout)
                current.temp += char;
            if (html || isJSE) {
                this.finaliseNode(char);
                return false;
            }
            let { word } = builder;
            if (current.firstRun) {
                if (current.temp.length > 1 || current.temp.length < 1)
                    word += char, current.temp = '';
                if ((0, utilities_1.isEmpty)(word) && !(0, utilities_1.isEmpty)(char))
                    word = char;
                current.value += word;
                current.firstRun = false;
            }
            else {
                if (current.stop) {
                    const text = current.temp + char;
                    if (current.value.endsWith(text))
                        current.value = current.value.substring(0, (current.value.length - text.length));
                }
                else {
                    if (!this.lookout)
                        current.value += current.temp + char, current.temp = '';
                }
                if (current.temp.length > 1)
                    current.temp = '';
            }
        }
    }
}
exports.Trim = Trim;
