"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraps = void 0;
const programs_1 = require("../../classes/beans/programs");
const scriptEngine_1 = require("../../classes/beans/programs/scriptEngine");
class Scraps extends programs_1.Program {
    constructor(props, options) {
        super(props);
        this.sourceType = 'Scraps';
        this.isStrict = true;
        this.scriptEngine = new scriptEngine_1.ScriptEngine(this);
        this.options = options;
        this.isSet = true;
    }
    set options(opts) {
        this.restLoc = opts.end;
        this.path = opts.start;
        this.sourceParent = opts.sourceParent;
        this.nodes = opts.children;
        this.trim.rerun = () => {
            this.trim.reset = true;
            this.reset = true;
            this.trim.run(this.path, {}, () => this.finish(), this);
        };
    }
    get body() {
        return this._body;
    }
    set body(value) {
        super.body = value;
    }
    close(run = false) {
        if (!run)
            return;
        //-- run
        this.compileScripts();
        this.resolveImportGlobs();
    }
    run() {
        // console.log(this.path)
        this.trim.run(this.path, {}, () => this.finish(), this);
    }
    compile() {
        this.close(true);
        this.nodes.__globals = this.globals;
        super.compile();
        return this.compiledText;
    }
    finish() {
        if (this.trim.current.type === 'TextNode')
            this.trim.current.isClosed = true;
        if (this.trim.current.isBlock && !this.trim.current.closed)
            this.trim.current.children.push(this.nodes);
        else
            this.body.push(this.nodes);
        this.trim.continue(this.restLoc);
    }
}
exports.Scraps = Scraps;
