"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Export = void 0;
const programs_1 = require("../../classes/beans/programs");
const scriptEngine_1 = require("../../classes/beans/programs/scriptEngine");
class Export extends programs_1.Program {
    constructor(props) {
        super(props);
        this.sourceType = 'Export';
        this.isStrict = true;
        this.scriptEngine = new scriptEngine_1.ScriptEngine(this);
        this._exports = [];
        this.isSet = true;
    }
    get exports() {
        return this._exports;
    }
    set exports(value) {
        if (Array.isArray(value))
            value.forEach(item => this.exports = item);
        else {
            if (this.exports.some(item => item.name === value.name))
                throw `Component with name '${value.name}' already exists`;
            this.exports.push(value);
            if (value.path !== this.path)
                value.path = this.path;
        }
    }
    get body() {
        return super.body;
    }
    set body(value) {
        super.body = value;
    }
    set reset(value) {
        super.reset = value;
        if (value)
            this._exports = [];
    }
    compile() {
        this.exports.forEach(item => {
            item.imports = this.imports;
            item.__globals = this.globals;
            item.exportClose = true;
        });
    }
}
exports.Export = Export;
