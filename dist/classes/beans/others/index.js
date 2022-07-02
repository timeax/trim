"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const element_1 = require("../element");
class Comment extends element_1.Element {
    constructor(props) {
        super(props);
        this.value = '';
        this.type = 'Comment';
        this.isSet = true;
    }
}
exports.Comment = Comment;
