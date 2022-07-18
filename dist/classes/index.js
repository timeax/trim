"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimBaseClass = void 0;
const parser_1 = __importDefault(require("./../components/util/parser"));
const html_1 = require("../components/html");
const utilities_1 = require("@timeax/utilities");
const jse_1 = require("../components/jse");
const others_1 = require("./beans/others");
const TextNode_1 = require("./beans/others/TextNode");
const Page_1 = require("../components/programs/Page");
const script_1 = require("./beans/script");
const programs_1 = require("./beans/programs");
const rules_1 = require("../components/jse/rules");
const Fragment_1 = require("./beans/html/Fragment");
const trim_config_json_1 = __importDefault(require("../conf/trim.config.json"));
class TrimBaseClass extends utilities_1.Default {
    //@ts-ignore
    constructor(props = trim_config_json_1.default) {
        super(props);
        this.tracker = false;
        this.base = '';
        this._path = '';
        this._currentPath = '';
        //@ts-ignore
        this._config = trim_config_json_1.default;
        this._line = 1;
        this._column = 0;
        this._opened = [];
        this._justClosed = false;
        this._counter = 0;
        this._word = '';
        this._isHTML = false;
        this._isJSE = false;
        this._store = 0;
        this._lookout = false;
        this._esc = false;
        this._temp = '';
        this._ignoreClose = false;
        this._firstRun = true;
        this.config = props;
    }
    get element() {
        //@ts-ignore
        if ((0, utilities_1.is)(this._element).null)
            return { type: null, isClosed: true };
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
        if ((0, utilities_1.isEmpty)(this.currentPath))
            this.currentPath = value;
    }
    get currentPath() {
        return this._currentPath;
    }
    set currentPath(value) {
        this._currentPath = value;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
    }
    get component() {
        return this._component;
    }
    set component(value) {
        this._component = value;
        if ((0, utilities_1.is)(value.path).null)
            value.path = this.currentPath;
    }
    get current() {
        //@ts-ignore
        if ((0, utilities_1.is)(this._current).null)
            return { type: null, isClosed: true };
        return this._current;
    }
    set current(value) {
        this.parent = null;
        //@ts-ignore
        let parent = (() => {
            let item = this.opened.find(item => !item.isBlock && item.type !== 'TextNode');
            // console.log(value.type, item?.type, item?.closed)
            if ((0, utilities_1.is)(item).notNull)
                throw 'Tag not closed..';
            const obj = this.opened.map(item => item).reverse().find(item => (!item.closed && item.isBlock));
            if ((0, utilities_1.is)(obj).null)
                return this.component;
            return obj;
        })();
        value.sourceParent = this.component;
        this._current = value;
        this.current.loc.path = this.currentPath;
        if ((0, utilities_1.is)(this.current).notNull) {
            this.current.loc.start = { column: this.column, line: this.line };
            if (this.current.type !== 'JsRule')
                this.opened.push(this.current);
        }
        if (this._current.type !== 'JsRule')
            this._current.parent = parent;
        else
            this.parent = parent;
    }
    set __current(value) {
        this._current = value;
    }
    get line() {
        return this._line;
    }
    set line(value) {
        this._line = value;
        this.column = 0;
        this.builder.clearBuild();
        if (this.current.type === 'Comment' && this.current.commentType === 'inline')
            this.current.closeComment = true;
    }
    createElement(value) {
        const obj = this.classes.find(item => item.name === value);
        return obj.type;
    }
    get column() {
        return this._column;
    }
    set column(value) {
        this._column = value;
    }
    get opened() {
        return this._opened;
    }
    set opened(value) {
        this._opened = value;
    }
    get builder() {
        return this._builder;
    }
    set builder(value) {
        this._builder = value;
    }
    get justClosed() {
        return this._justClosed;
    }
    set justClosed(value) {
        this._justClosed = value;
        if (value) {
            this.lookout = false;
            this.type = null;
            this.isHTML = false;
            this.isJSE = false;
            this.esc = false;
            this.builder.clear();
        }
    }
    get counter() {
        return this._counter;
    }
    set counter(value) {
        this._counter = value;
    }
    get word() {
        return this._word;
    }
    set word(value) {
        this._word = value;
    }
    get isHTML() {
        return this._isHTML;
    }
    set isHTML(value) {
        this.word = '';
        this.counter = 0;
        this._isHTML = value;
    }
    get isJSE() {
        return this._isJSE;
    }
    set isJSE(value) {
        this.word = '';
        this.counter = 0;
        this._isJSE = value;
    }
    get store() {
        return this._store;
    }
    set store(value) {
        this._store = value <= 0 ? 0 : value;
    }
    get classes() {
        return this._classes;
    }
    set classes(value) {
        this._classes = value;
    }
    get lookout() {
        return this._lookout;
    }
    set lookout(value) {
        this._lookout = value;
    }
    get compileType() {
        return this._compileType;
    }
    set compileType(value) {
        this._compileType = value;
    }
    get esc() {
        return this._esc;
    }
    set esc(value) {
        this._esc = value;
    }
    get type() {
        return this._type;
    }
    set type(value) {
        this._type = value;
    }
    get temp() {
        return this._temp;
    }
    set temp(value) {
        this._temp = value;
    }
    get ignoreClose() {
        return this._ignoreClose;
    }
    set ignoreClose(value) {
        this._ignoreClose = value;
    }
    get firstRun() {
        return this._firstRun;
    }
    set firstRun(value) {
        this._firstRun = value;
    }
    init() {
        this.classes = [
            //@ts-ignore
            { name: 'HTML', type: html_1.HTML },
            //@ts-ignore
            { name: 'JsE', type: jse_1.JsE },
            //@ts-ignore
            { name: 'JsRule', type: rules_1.JsRule },
            //@ts-ignore
            { name: 'TextNode', type: TextNode_1.TextNode },
            //@ts-ignore
            { name: 'Comment', type: others_1.Comment },
            //@ts-ignore
            { name: 'Script', type: script_1.Script },
            //@ts-ignore
            { name: 'Fragment', type: Fragment_1.Fragment },
        ];
        this.builder = {
            word: '',
            text: '',
            temp: '',
            type: '',
            build: '',
            clear: (args) => {
                // console.log(args);
                this.builder.word = '';
                this.builder.text = '';
                this.builder.type = '';
            },
            clearText: () => {
                this.builder.word = this.builder.text;
                this.builder.text = '';
                this.builder.build = '';
                this.builder.type = '';
            },
            clearBuild: () => {
                this.builder.build = '';
            }
        };
    }
    finish() { this.haltProgram(); }
    setup(program, path, options) {
        const Program = program ? program : this.getProgram(this.parseName(path));
        if ((0, utilities_1.is)(Program).null)
            throw 'Program not found';
        //@ts-ignore
        this.component = program ? program : new Program(this, options);
        this.component.path = path;
        this.component.isClosed = true;
        this.line = 1;
    }
    parseName(path) {
        if (utilities_1.Fs.exists(path)) {
            const fname = utilities_1.Fs.name(path);
            if (fname.startsWith('_'))
                return 'Assets';
            else
                return 'Page';
        }
        else
            this.throw('File not found', 'FileNotFound');
    }
    getProgram(name) {
        if (name == 'Page')
            return Page_1.Page;
        else if (name == 'Assets')
            return programs_1.Program;
    }
    handle(char, prevChar = '') {
        const { builder, current } = this;
        let newline = char === null ? false : parser_1.default.isNl(char);
        let whitespace = char == null ? false : parser_1.default.isWs(char);
        let charTrack = char == null && true;
        prevChar = (0, utilities_1.isEmpty)(prevChar) ? '' : prevChar;
        let text = char == null ? '' : char;
        //=== textnodes close
        if (current.type === 'TextNode' && charTrack) {
            text = current.temp + prevChar;
            current.stop = true;
            current.isClosed = true;
        }
        // increments 
        if (!charTrack)
            (this.column++, builder.build += char);
        if (newline)
            this.line++;
        //=== ignored 
        if (!charTrack)
            if (this.ignoreNext(char))
                return;
        // compile current 
        if (!this.parseCurrent(text))
            return;
        // ---##
        if (this.justClosed)
            return (this.justClosed = false);
        //===============
        builder.text += text;
        if (this.finaliseNode(char))
            return;
        //----------------
        if (this.justClosed)
            return (this.justClosed = false);
        //===============
        this.charTracker(char);
        //--
        this.parseChar(char);
        //--
        if (newline || whitespace || charTrack) {
            builder.clearText();
            // parse new word
            const type = parser_1.default.parse(builder.word);
            const objType = this.createElement(type);
            const call = () => {
                this.store = 0;
                //@ts-ignore
                const obj = new objType(this);
                if (obj.type === 'JsE') {
                    if (builder.word === '{%')
                        obj.sourceType = 'script';
                }
                else if (obj.type === 'Comment')
                    obj.commentType = builder.word === '//' ? 'inline' : 'block';
                this.current = obj;
                if (this.current.type === 'Fragment')
                    this.current.isClosed = true;
            };
            if (type !== 'TextNode') {
                if (current.type === 'TextNode')
                    if (!current.closed)
                        current.isClosed = true;
                call();
            }
            else {
                if ((0, utilities_1.is)(this.current).null) {
                    if (!(0, utilities_1.isEmpty)(builder.word))
                        call();
                }
                else
                    call();
            }
        }
    }
    finaliseNode(char, current = null) {
        throw new Error('Method not implemented.');
    }
    charTracker(char, ignore = false) {
        if ((0, utilities_1.is)(char).null)
            return;
        const active = this.current.type === null ? false : !this.current.isClosed;
        // check current component 
        if (active) {
            // return if component is open and is not a text node
            if (this.current.type !== 'TextNode')
                return;
        }
        //####################
        const play = (run = true) => !ignore && run && this.handle(null, char);
        //-------
        if (this.lookout) {
            if (this.type == 'angle-bracket') {
                if (parser_1.default.isWord(char) || char === '%' || char == '>')
                    play();
                else if (char === '/')
                    this.isHTML = true;
            }
            else if (this.type === 'brace') {
                if (char === '/')
                    this.isJSE = true;
                else
                    play(char === '{' || char === '%' || char === '@');
            }
            else if (this.type === 'slash')
                play(char === '*' || char === '/');
        }
        else {
            if ((this.line === 1 && this.column === 1) && !parser_1.default.isWN(char) && (["<", "{", "/"].includes(char)))
                return;
            //---
            if (parser_1.default.isWord(char) && this.current.type !== 'TextNode' && !this.isHTML)
                play(true);
            else
                play(!(0, utilities_1.isEmpty)(char) && !(["<", "{", "/"].includes(char)) && !parser_1.default.isWord(char) && this.current.type !== 'TextNode');
        }
    }
    parseChar(char) {
        switch (char) {
            case '<':
                this.lookout = true;
                this.type = 'angle-bracket';
                break;
            case '{':
                this.lookout = true;
                this.type = 'brace';
                break;
            case '/':
                this.lookout = true;
                this.type = 'slash';
                break;
            case '\\':
                this.esc = true;
                break;
            default:
                this.lookout = false;
                this.type = null;
                this._temp = '';
                this.esc = false;
                break;
        }
    }
    parseCurrent(text) {
        throw new Error('Method not implemented.');
    }
    parseJsE(char, ignore, element) {
        throw new Error('Method not implemented.');
    }
    ignoreNext(char, prev = '') {
        const { current } = this;
        let ans = false;
        if (current.type == null)
            return false;
        if (current.type == 'Script')
            return false;
        //--
        if (current.isBlock) {
            if (current.compileAsText) {
                ans = true;
                if (current.isClosed) {
                    if (this.finaliseNode(char))
                        return !current.closed;
                    this.charTracker(char, true);
                    this.parseChar(char);
                    current.value += char;
                }
            }
        }
        return ans;
    }
    find(node, name) {
        name = name.trim();
        //@ts-ignore
        const rearranged = this.opened.map(item => item).reverse().filter(item => item.isBlock);
        const create = (type, name) => type == 'HTML' ? `<${name} ...>` : `{@${name} ...}`;
        for (const component of rearranged) {
            if (component.type === node) {
                if (component.name === name) {
                    const index = rearranged.indexOf(component);
                    if (!(0, utilities_1.is)(rearranged[index - 1]).null)
                        this.throw(`Expected corresponding closing tag for ${create(rearranged[index - 1].type, rearranged[index - 1].name)}\n\tat ${utilities_1.Fs.name(this.currentPath)}:${this.line}:${this.column - name.length}`);
                    //@ts-ignore
                    return component;
                }
            }
        }
        return null;
    }
    set reset(restart) {
        this.__current = null;
        this.line = 1;
        this.lookout = false;
        this.type = null;
        this.temp = '';
        this.opened = [];
        this.justClosed = false;
        this.builder.clear();
        // if (this.component.exports.length > 0) return;
        this.component.closed = !restart;
    }
    closeText() {
        if (this.current.type === 'TextNode') {
            if ((0, utilities_1.isEmpty)(this.current.value)) {
                if (!(0, utilities_1.isEmpty)(this.builder.word)) {
                    if (this.builder.word.length == 1) {
                        this.current.value = this.builder.word;
                        this.builder.clear();
                    }
                }
            }
        }
        else {
            if (this.component.body.length === 0) {
                if (['/', '<', '{'].includes(this.builder.text)) {
                    this.current = new TextNode_1.TextNode(this);
                    this.current.value = this.builder.text;
                    this.current.isClosed = true;
                }
            }
        }
    }
    haltProgram() {
        this.closeText();
        let counter = 0;
        while (this.opened.length > 0) {
            this.opened.forEach(item => {
                if (item.type == 'TextNode' || item.type == 'Comment')
                    item.isClosed = true;
            });
            //@ts-ignore
            if (counter === 10)
                this.throw('Please close all your tags \n' + this.opened.map(item => `${item.loc.source} at ${utilities_1.Fs.name(item.loc.path)}:${JSON.stringify(item.loc.start.line)} `), 'UnclosedTagsException');
            counter++;
        }
    }
}
exports.TrimBaseClass = TrimBaseClass;
//? ((this.type == 'brace' || this.isHTML) && run) && this.ignoreNext(null, char) :
// if (current.type === 'HTML') {
//     if (this.isHTML) {
//         this.temp += char;
//         if (this.htmlClose(char))
//             return !current.closed;
//     }
// } else if (this.element.type === 'JsE') {
//     //--- avoid html logs
//     this.isHTML = false;
//     //-----
//     this.temp += char;
//     //-- commented code at end of file -- //
//     this.parseJsE(char, true, this.element);
//     //=======------>>>>
//     if (this.element.type === null) current.value += this.temp, this.temp = '';
//     if (current.stop) current.value = current.value.substring(0, current.value.length - 2), current.closed = true, this.justClosed = true;
//     //-----
//     return !current.closed;
// }
