"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextNode = void 0;
const utilities_1 = require("@timeax/utilities");
const element_1 = require("../element");
class TextNode extends element_1.Element {
    constructor(props) {
        super(props);
        this.value = '';
        this.type = 'TextNode';
        this.isSet = true;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        if (value && this.isClosed)
            return;
        super.isClosed = value;
        if (!(0, utilities_1.is)(this.parent).null && this.parent.type !== 'Program')
            this.parent = this.parent;
        else {
            if ((0, utilities_1.isEmpty)(this.value)) {
                const index = this.sourceParent.body.findIndex(item => item === this);
                this.sourceParent.body.splice(index, 1);
            }
            else if (this.sourceParent.sourceType === 'Export')
                throw 'Place tag in fragment';
        }
    }
    compile() {
        var _a, _b;
        if ((0, utilities_1.is)(this.parent).null)
            return this.value.trim();
        const ref = ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.type) == 'HTML' || ((_b = this.parent) === null || _b === void 0 ? void 0 : _b.type) === 'JsRule' ? 'children' : 'body';
        if (this.parent.preserveText)
            return this.value;
        else {
            const size = this.parent[ref].length;
            const index = this.parent[ref].findIndex(item => item === this);
            if (index <= 0 && this.parent.type == 'JsRule' && this.parent.name == 'scraps')
                this.value;
            else if (index <= 0)
                this.value = this.value.trimStart();
            else {
                const prev = this.parent[ref][index - 1];
                if (prev.type == 'JsE' || prev.type == 'Comment') {
                    if (prev.sourceType == 'script' || prev.type == 'Comment')
                        this.value = this.value.trimStart();
                }
                const next = this.parent[ref][index + 1];
                if ((next === null || next === void 0 ? void 0 : next.type) === 'JsE' || (next === null || next === void 0 ? void 0 : next.type) === 'Comment') {
                    if (prev.sourceType == 'script' || prev.type == 'Comment')
                        this.value = this.value.trimEnd();
                }
            }
            if (index == size - 1 && this.parent.type == 'JsRule' && this.parent.name == 'scraps')
                this.value;
            else if (index == size - 1)
                this.value = this.value.trimEnd();
        }
        return this.value;
    }
}
exports.TextNode = TextNode;
