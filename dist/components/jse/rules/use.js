"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const __1 = require("../../..");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
const export_1 = require("../../programs/export");
class Use extends _1.Compiler {
    constructor(props) {
        super(props);
        this.rule = props;
    }
    run(param = ['']) {
        const stmt = `import ${param[0].trim()}`;
        const props = linter_1.default.parseImportStatement(stmt);
        this.src = (() => {
            let path = props[0].src;
            if (!path.startsWith('.') && !path.startsWith('/'))
                return path;
            return utilities_1.Fs.join(utilities_1.Fs.dirname(this.rule.loc.path), path);
        })();
        this.imports = props[0].imports.map(item => ({ local: item.local, name: item.imported, default: item.default }));
        this.load();
    }
    load() {
        const pageExport = this.pageExport;
        const getObj = (item, imp) => {
            const obj = item.clone;
            obj.ref = imp.local;
            obj.globalParent = this.rule.sourceParent;
            return obj;
        };
        //----
        const exports = pageExport.exports.map(item => {
            const imp = this.imports.filter(item => !item.default).find(ref => ref.name === item.name);
            let valid = '';
            if (!(0, utilities_1.is)(imp).null)
                valid = getObj(item, imp);
            return valid;
        }).filter(item => typeof item === 'object');
        //----
        const def = pageExport.exports.find(item => item.isDefault);
        const imp = this.imports.find(item => item.default);
        //---
        if (!(0, utilities_1.is)(imp).null && !(0, utilities_1.is)(def).null)
            exports.push(getObj(def, imp));
        //@ts-ignore
        this.rule.sourceParent.imports = exports;
    }
    get path() {
        return super.path;
    }
    set path(value) {
        super.path = value;
        if (!utilities_1.Fs.name(value).startsWith('_'))
            this.throw('Filename must begin with an underscore..', 'FileNameError');
    }
    get pageExport() {
        const getExport = () => {
            const pageExport = new export_1.Export(new __1.Trim());
            pageExport.trim.programRun(pageExport, this.path);
            global.Exports.push({ path: this.path, program: pageExport });
            return pageExport;
        };
        if (global.Exports.length === 0)
            return getExport();
        else {
            const obj = global.Exports.find(item => utilities_1.Fs.samePath(item.path, this.path));
            if ((0, utilities_1.is)(obj).null)
                return getExport();
            else
                return obj.program;
        }
    }
}
exports.default = Use;
