"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageBase = void 0;
const _1 = require(".");
const scriptEngine_1 = require("./scriptEngine");
class PageBase extends _1.Program {
    constructor(props, options) {
        super(props, options);
        this.sourceType = 'Page';
        this.scriptEngine = new scriptEngine_1.ScriptEngine(this);
    }
    emit() {
    }
    close() {
        super.close();
        this.emit();
    }
    compile() {
        this.clear = true;
        if (this.recompile)
            this.hasSet = false, this.compileScripts(), this.recompile = false;
        if (!this.hasSet)
            this.resolveImportGlobs();
        super.compile();
    }
}
exports.PageBase = PageBase;
