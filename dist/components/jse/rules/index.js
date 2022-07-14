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
    set src(value) {
        this.path = this.setSrc(value);
    }
    setSrc(value) {
        if ((0, utilities_1.isEmpty)(utilities_1.Fs.ext(value))) {
            const dir = utilities_1.Fs.dirname(value);
            const name = `_${utilities_1.Fs.name(value)}.trim`;
            value = utilities_1.Fs.join(dir, name);
        }
        return value;
    }
}
exports.Compiler = Compiler;
