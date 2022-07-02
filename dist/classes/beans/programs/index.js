"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const utilities_1 = require("@timeax/utilities");
const __1 = require("..");
class Program extends __1.BaseNode {
    constructor(trim, options) {
        super(trim);
        this.type = 'Program';
        this.scriptCount = 0;
        this.isStrict = true;
        this._body = [];
        this._imports = [];
        this._assets = [];
        this._scripts = [];
        this._globals = { props: {} };
        //@ts-ignore
        this._props = { children: [] };
        this._recompile = false;
        this._rerun = false;
        this.trim = trim;
        this.isBlock = true;
        this.optionsSettings(options);
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
    }
    get body() {
        return this._body;
    }
    set body(value) {
        if (Array.isArray(value))
            this._body = value;
        else {
            //@ts-ignore
            if (value.parent === this) {
                //@ts-ignore
                if (value.type !== 'Script')
                    this._body.push(value);
                //@ts-ignore
                else
                    this.scripts = value;
            }
            else if (value.type === 'Script')
                throw 'cannot nest scriptlet tag';
        }
    }
    //@ts-ignore
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
        if (!(0, utilities_1.is)(this.parent).null) {
            if (value.type === 'Program')
                value.body = this;
            //@ts-ignore
            else
                this.parent.children = this;
        }
    }
    get imports() {
        return this._imports;
    }
    set imports(value) {
        if (Array.isArray(value))
            value.forEach(item => this.imports = item);
        else
            this._imports.push(value);
    }
    get assets() {
        return this._assets;
    }
    set assets(value) {
        if (Array.isArray(value))
            this._assets = value;
        else if (!this.assets.includes(value))
            this._assets.push(value);
    }
    get scripts() {
        return this._scripts;
    }
    set scripts(value) {
        if (Array.isArray(value))
            this._scripts = value;
        else {
            value.compileId = this.scriptEngine.compileId;
            const index = this.scripts.findIndex(item => utilities_1.Fs.samePath(value.loc.path, item.loc.path));
            if (index == -1) {
                if (this.scriptCount > 0 && value.loc.path === this.loc.path)
                    throw 'scriptlet already exists on this path';
                this._scripts.push(value);
            }
            else {
                const script = this.scripts[index];
                if (script.compileId === value.compileId)
                    throw 'scriptlet already exists on this path';
                else
                    this.scripts[index] = value;
            }
        }
        if (this.scripts.length > 0)
            this.scriptCount++;
    }
    close() {
        this.compileScripts();
        this.resolveImportGlobs();
        this.compile();
    }
    set sourceChange(value) {
        this.sourceParent = value;
    }
    compileScripts() {
        if (this.scriptCount > 0) {
            const value = this.scripts.map(script => script.value).join('\n');
            this.scriptEngine.value = value;
            this.scriptEngine.compile();
            this.setGlobals();
        }
        else if (this.scriptEngine.env.length > 0)
            this.setGlobals();
    }
    setGlobals() {
        this.scriptEngine.env.forEach(env => this.globals = env);
        this.globals['props'] = this.props;
    }
    resolveImportGlobs() {
        this.imports.filter(item => !item.isStrict)
            .forEach(item => item.__globals = this.globals);
        this.hasSet = true;
    }
    //@ts-ignore
    get globals() {
        return this._globals;
    }
    set globals(value) {
        if ((0, utilities_1.is)(value).null)
            return;
        this._globals[value.name] = value.value;
    }
    set __globals(value) {
        if ((0, utilities_1.is)(value).notNull)
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    const element = value[key];
                    this._globals[key] = element;
                }
            }
    }
    compile() {
        this.clear = true;
        this.body.forEach(item => this.compiledText = item.compile());
        return this.compiledText;
    }
    get props() {
        return this._props;
    }
    set props(value) {
        if ((0, utilities_1.is)(value).null)
            return;
        if (Array.isArray(value))
            value.forEach(item => this.props = item);
        else if ((value === null || value === void 0 ? void 0 : value.type) == 'Attributes')
            this._props[value.compiledName] = value.raw;
        else if (typeof value === 'object') {
            for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    const item = value[key];
                    this._props[key] = item;
                }
            }
        }
        this._globals.props = this.props;
    }
    get recompile() {
        return this._recompile;
    }
    set recompile(value) {
        this._recompile = value;
        if (value) {
            const script = this.scripts.map(item => item.value).join('\n');
            this.scriptEngine.value = script;
            this.scriptEngine.compileId++;
            this.close();
        }
    }
    get pageComponent() {
        //@ts-ignore
        if (this.sourceType == 'Page')
            return this;
        //@ts-ignore
        else if ((0, utilities_1.is)(this.sourceParent).null)
            return { trim: {} };
        if (this.sourceParent.sourceType == 'Page')
            return this.sourceParent;
        else
            return this.sourceParent.pageComponent;
    }
    get rerun() {
        return this._rerun;
    }
    set rerun(value) {
        this._rerun = value;
        if (value) {
            this.trim.rerun();
            if (this.sourceType !== 'Page' && this.sourceType !== 'Export') {
                this.pageComponent.recompile = true;
            }
            this.rerun = false;
        }
    }
    set reset(value) {
        var _a;
        if (value) {
            this.props = {};
            this._globals = { props: {} };
            //@ts-ignore
            (_a = this.scriptEngine) === null || _a === void 0 ? void 0 : _a.reset = true;
            this.scriptCount = 0;
            this.hasSet = false;
            this._body = [];
            this._scripts = [];
            this._imports = [];
            this._assets = [];
            this.clear = true;
            this.closed = false;
        }
    }
    optionsSettings(options) {
        if ((0, utilities_1.is)(options).null)
            return;
        this.__globals = options === null || options === void 0 ? void 0 : options.globals;
        this.props = options.props;
        this.sourceParent = options.sourceParent;
    }
}
exports.Program = Program;
