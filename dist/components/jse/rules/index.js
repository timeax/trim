"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const utilities_1 = require("@timeax/utilities");
class Compiler extends utilities_1.Default {
    constructor(props) {
        super(props);
    }
    init() {
        this.rule.compile = () => this.compile();
    }
    run(...props) {
    }
    compile() {
        return '';
    }
    get path() {
        return this._path;
    }
    set path(value) {
        if (utilities_1.Fs.exists(value))
            this._path = utilities_1.Fs.formatPath(value);
        else
            throw `Path '${value}' does not exist`;
    }
}
exports.Compiler = Compiler;
