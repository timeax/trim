"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentBase = void 0;
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const scriptEngine_1 = require("./scriptEngine");
class ComponentBase extends _1.Program {
    constructor(props) {
        super(props);
        this.sourceType = 'Export';
        this.isStrict = true;
        this.isDefault = false;
        this.scriptEngine = new scriptEngine_1.ScriptEngine(this);
    }
    get ref() {
        return this._ref;
    }
    set ref(value) {
        this._ref = value;
    }
    set exportClose(value) {
        throw new Error('Method not implemented.');
    }
    init() {
        super.init();
        this.setTrimProps();
    }
    setTrimProps() {
        this.trim.rerun = () => this.resetExport = true;
    }
    set resetExport(value) {
        if (value) {
            const obj = this.sourceParent.exports.find(item => item.name == this.name);
            //@ts-ignore
            const index = this.globalParent.imports.findIndex(item => item == this);
            this.globalParent.imports.splice(index, 1);
            if (!(0, utilities_1.is)(obj).null) {
                const exp = obj.clone;
                exp.ref = this.ref;
                exp.globalParent = this.globalParent;
                this.globalParent.imports.push(exp);
                this.globalParent.pageComponent.recompile = true;
            }
        }
    }
    get fragment() {
        return this._fragment;
    }
    set fragment(value) {
        this._fragment = value;
        //@ts-ignore ----------
        this.fragment.scriptEngine = this.scriptEngine;
    }
    get jsRule() {
        return this._jsRule;
    }
    set jsRule(value) {
        if ((0, utilities_1.is)(this.jsRule).notNull)
            throw 'Fragment already exist on this component';
        this._jsRule = value;
    }
    close() {
    }
}
exports.ComponentBase = ComponentBase;
