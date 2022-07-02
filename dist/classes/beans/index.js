"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNode = void 0;
const utilities_1 = require("@timeax/utilities");
class BaseNode extends utilities_1.Default {
    constructor(props) {
        super(props);
        this.loc = { start: null, end: null, path: '' };
        this.firstRun = true;
        this.compiler = this;
        this._isBlock = false;
        this._closed = false;
        this._isClosed = false;
        this._store = 0;
        this._compiledText = '';
        this.caller = props;
        this.compiler = this;
    }
    get isBlock() {
        return this._isBlock;
    }
    set isBlock(value) {
        this._isBlock = value;
    }
    get closed() {
        return this._closed;
    }
    set closed(value) {
        if (value && this.closed)
            return;
        this._closed = value;
        if (!this.isClosed)
            this._isClosed = value;
        if (value) {
            (0, utilities_1.avoid)(err => {
                //@ts-ignore
                const index = this.caller.opened.findIndex(item => item === this);
                if (index === -1)
                    return;
                this.caller.opened.splice(index, 1);
            }).then((err, msg) => {
                if (!err)
                    this.close();
            });
        }
    }
    get isClosed() {
        return this._isClosed;
    }
    set isClosed(value) {
        if (this.isClosed && value)
            return;
        this._isClosed = value;
        if (!this.isBlock && !this.closed)
            this.closed = value;
    }
    set __closed(value) {
        this._closed = value;
    }
    get globalParent() {
        return this._globalParent;
    }
    set globalParent(value) {
        this._globalParent = value;
    }
    get caller() {
        return this._caller;
    }
    set caller(value) {
        this._caller = value;
    }
    get store() {
        return this._store;
    }
    set store(value) {
        this._store = value <= 0 ? 0 : value;
    }
    set sourceChange(value) {
        throw new Error("Method not implemented.");
    }
    get compiledText() {
        return this._compiledText;
    }
    set compiledText(value) {
        if (value == '***clear!!***') {
            this._compiledText = '';
            return;
        }
        this._compiledText += value;
    }
    set clear(value) {
        if (value)
            this.compiledText = '***clear!!***';
    }
    close() {
    }
    compile() {
        return '';
    }
}
exports.BaseNode = BaseNode;
