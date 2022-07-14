"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Include = void 0;
const utilities_1 = require("@timeax/utilities");
const TextNode_1 = require("../../classes/beans/others/TextNode");
const programs_1 = require("../../classes/beans/programs");
const scriptEngine_1 = require("../../classes/beans/programs/scriptEngine");
const script_1 = require("../../classes/beans/script");
class Include extends programs_1.Program {
    constructor(props, options) {
        super(props, options);
        this.exts = ['.htm', '.txt', '.js', '.trim'];
        this.sourceType = 'Include';
        this.fileContent = '';
        this.isStrict = false;
        this.scriptEngine = new scriptEngine_1.ScriptEngine(this);
        this.isSet = true;
    }
    ;
    get path() {
        return super.path;
    }
    set path(value) {
        super.path = value;
        //@ts-ignore
        if (!this.exts.includes(utilities_1.Fs.ext(value)))
            throw TypeError(`Unsupported extension '${utilities_1.Fs.ext(value)}'`);
        //@ts-ignore
        this.ext = utilities_1.Fs.ext(value);
        if (this.ext == '.htm' || this.ext === '.trim')
            this.program = this;
        this.fileContent = utilities_1.Fs.content(value);
    }
    run() {
        if (this.ext === '.htm' || this.ext === '.trim') {
            if (!utilities_1.Fs.name(this.path).startsWith('_'))
                throw 'Filename must start with an underscore';
            //@ts-ignore
            this.trim.programRun(this.program, this.fileContent, this.path);
            this.program.parent = this.parentNode;
        }
        else {
            if (this.ext === '.js') {
                const script = new script_1.Script(this.sourceParent.trim);
                script.loc.path = this.path;
                script.sourceParent = this.sourceParent;
                script.value = this.fileContent;
                script.parent = this.parentNode;
                this.isClosed = true;
            }
            else {
                const text = new TextNode_1.TextNode(this.sourceParent.trim);
                text.value = this.fileContent;
                text.parent = this.parentNode;
                text.sourceParent = this;
                text.isClosed = true;
            }
        }
    }
    get rerun() {
        return super.rerun;
    }
    set rerun(value) {
        if (value) {
            if (this.ext == '.htm' || this.ext === '.trim')
                super.rerun = true;
            else
                this.sourceParent.rerun = true;
        }
    }
    compile() {
        if (!this.isStrict)
            this.__globals = this.sourceParent.globals;
        return super.compile();
    }
    close() {
        if (this.ext !== '.htm' && this.ext !== '.trim')
            return;
        this.compileScripts();
        //@ts-ignore
        this.resolveImportGlobs();
    }
}
exports.Include = Include;
