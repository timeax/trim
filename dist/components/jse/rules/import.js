"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const extract_1 = require("../../../classes/util/extract");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
const require_1 = require("../../util/require");
class Imports extends _1.Compiler {
    constructor(props) {
        super(props);
        this.compiledId = 0;
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        if (params.length > 1 || params.length < 1)
            throw 'Expected 1 argument but found ' + params.length;
        const stmt = `import ${params[0].trim()}`;
        const result = linter_1.default.parseImportStatement(stmt);
        if (result.length < 1)
            return;
        const { src, imports } = result[0];
        this.imports = imports;
        if (src.startsWith('.') || src.startsWith('/'))
            this.path = utilities_1.Fs.join(utilities_1.Fs.dirname(this.rule.loc.path), src);
        else
            this.path = src;
        this.names = imports.map(item => item.local);
        this.extract();
    }
    extract() {
        const code = this.buildCode();
        const revert = (0, require_1.moduleLoader)(this.path);
        (0, extract_1.extractVars)(code, ({ value, key }) => {
            const varObj = {
                type: 'const',
                name: key,
                value: value,
                id: this.rule.sourceParent.scriptEngine.compileId
            };
            try {
                this.rule.sourceParent.scriptEngine.__env = varObj;
                this.rule.sourceParent.assets = this.path;
            }
            catch (error) {
                throw error;
            }
        });
        revert();
    }
    buildCode() {
        let code = 'var require = global.require || global.process.mainModule.constructor._load; ', returnCode = 'return {';
        this.imports.forEach((item, index) => {
            if (item.default)
                code += `const ${item.local} = require('${this.path}');`;
            else
                code += `const ${item.local} = require('${this.path}').${item.imported}; `;
            if (index == this.imports.length - 1)
                returnCode += item.local + '};';
            else
                returnCode += item.local + ' ,';
        });
        return code + returnCode;
    }
}
exports.default = Imports;
