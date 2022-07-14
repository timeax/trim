"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const element_1 = require("../element");
class Comment extends element_1.Element {
    constructor(props) {
        super(props);
        this.value = '';
        this.type = 'Comment';
        this.closeComment = false;
        this.isSet = true;
    }
    get commentType() {
        return this._commentType;
    }
    set commentType(value) {
        this._commentType = value;
        this.loc.source = value == 'inline' ? '//' : '/*';
    }
}
exports.Comment = Comment;
