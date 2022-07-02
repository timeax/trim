"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
const linter_1 = __importDefault(require("../../util/linter"));
const element_1 = require("../element");
class Script extends element_1.Element {
    constructor(props) {
        super(props);
        this.value = '';
        this.type = 'Script';
        this._compileId = 0;
        this.isSet = true;
    }
    get compileId() {
        return this._compileId;
    }
    set compileId(value) {
        this._compileId = value;
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        if (value && linter_1.default.lintText(this.value))
            super.isClosed = value;
    }
}
exports.Script = Script;
