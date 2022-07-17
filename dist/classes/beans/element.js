"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parent = exports.Element = void 0;
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
class Element extends _1.BaseNode {
    constructor(props) {
        super(props);
        this.isUseless = false;
        this.preserveText = false;
        this._temp = '';
    }
    get temp() {
        return this._temp;
    }
    set temp(value) {
        this._temp = value;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        if (value && this.isClosed)
            return;
        super.isClosed = value;
    }
    //@ts-ignore
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
        if (!(0, utilities_1.is)(this.parent).null) {
            if (value.type === 'Program')
                value.body = this;
            else
                this.parent.children = this;
        }
    }
    get compileAsText() {
        return this._compileAsText;
    }
    set compileAsText(value) {
        this.caller.ignoreClose = false;
        this.caller.element = null;
        this._compileAsText = value;
    }
    set sourceChange(value) {
        this.sourceParent = value;
    }
    close() {
        this.__close = true;
    }
    set shut(v) {
        this.__close = v;
    }
    set __close(value) {
        if (value) {
            if (!this.isUseless) {
                const { current, builder } = this.caller;
                if ((0, utilities_1.is)(current).null)
                    return;
                builder.clear();
                let ref = current.parent;
                if ((0, utilities_1.is)(ref).null || ref.type == 'Program') {
                    this.caller.__current = null;
                    return;
                }
                while (true) {
                    if (ref.closed) {
                        ref = ref.parent;
                    }
                    else
                        break;
                }
                //@ts-ignore
                this.caller.__current = ref;
            }
        }
    }
}
exports.Element = Element;
class Parent extends Element {
    constructor() {
        super(...arguments);
        this._children = [];
    }
    get name() {
        return '';
    }
    set name(value) { }
    get children() {
        return this._children;
    }
    childTest(child) {
        return { msg: 'success', valid: true };
    }
    set sourceChange(value) {
        this.sourceParent = value;
        this.children.forEach(item => item.sourceChange = value);
    }
    set children(value) {
        if (Array.isArray(value))
            this._children = value;
        else {
            if (value instanceof _1.BaseNode) {
                const { msg, valid } = this.childTest(value);
                if (!valid)
                    this.throw(msg, 'TypeError');
                else if (msg === 'ignore')
                    return;
                //----
                if (value.type === 'Script')
                    throw 'Cannot nest scripts';
                if (this.type == 'HTML' || this.type === 'JsRule') {
                    if (this.preserveText)
                        value.preserveText = true;
                }
                if (value.type == 'TextNode' && !value.closed)
                    return;
                this.children.push(value);
                if (!this.preserveText) {
                    if (value.type === 'TextNode' && (0, utilities_1.isEmpty)(value.value))
                        this.children.pop();
                }
            }
        }
    }
}
exports.Parent = Parent;
