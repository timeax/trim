"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nodemap = void 0;
const utilities_1 = require("@timeax/utilities");
const Nodemap_1 = require("../../classes/beans/programs/Nodemap");
class Nodemap extends Nodemap_1.NodemapBase {
    constructor(parent, props) {
        var _a, _b;
        super(props);
        this.isSet = true;
        this.sourceParent = parent;
        this.scriptEngine = (_a = this.sourceParent) === null || _a === void 0 ? void 0 : _a.scriptEngine;
        this.engine = (_b = this.sourceParent) === null || _b === void 0 ? void 0 : _b.scriptEngine;
    }
    run(text, type = 'ElementMap', path = '') {
        this.nodeType = type;
        if (type == 'NameMap') {
            if (this.firstRun)
                this.trim.component = this;
            return this.map(text);
        }
        else {
            this.trim.nodemap(this, text, path);
        }
    }
    map(char) {
        this.firstRun = false;
        this.handle(char);
        return this.closed;
    }
    close() {
    }
    get rerun() {
        return super.rerun;
    }
    set rerun(value) {
        this.sourceParent.rerun = value;
    }
    compile(run = true, engine = this.engine) {
        if ((0, utilities_1.is)(this.sourceParent).notNull) {
            this.imports.length = 0;
            this.scriptEngine = engine;
            this.__imports = this.sourceParent.imports;
            if (run)
                this.__globals = this.sourceParent.globals;
        }
        return super.compile();
    }
}
exports.Nodemap = Nodemap;
