"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsE = void 0;
const utilities_1 = require("@timeax/utilities");
const beans_1 = require("../../classes/beans");
const jse_1 = require("../../classes/beans/jse");
const extract_1 = require("../../classes/util/extract");
const nodemap_1 = require("../programs/nodemap");
class JsE extends jse_1.JsEBase {
    constructor(props) {
        super(props);
        this.isSet = true;
    }
    compile() {
        this.clear = true;
        if (this.sourceType == 'expression') {
            this.lint();
            //----
            let result = (0, extract_1._call)(this.sourceParent.globals, this.script);
            // console.log(result)
            if (!this.sourceParent.trim.config.compilerOptions.allowNullValues) {
                if ((0, utilities_1.is)(result).null)
                    return '';
            }
            //---
            this.raw = result;
            this.compiledText = this.compileResult(result);
        }
        else {
            //--
            const code = this.parseScript();
            (0, extract_1.extractVars)(code, ({ value, key }) => {
                this.sourceParent.globals[key] = value;
            }, false, this.sourceParent.globals);
        }
        return this.compiledText;
    }
    compileResult(result) {
        let compiled = '';
        switch (typeof result) {
            case 'string':
                compiled = this.filter(result);
                break;
            case 'function':
                compiled = result();
                break;
            case 'object':
                if (Array.isArray(result)) {
                    result.forEach(item => {
                        compiled += this.compileResult(item);
                    });
                }
                else if (result instanceof beans_1.BaseNode) {
                    compiled = result.compile();
                }
                break;
            default:
                compiled = result;
                break;
        }
        return compiled;
    }
    filter(text) {
        if (text.startsWith('-jsx-code-')) {
            const nodemap = new nodemap_1.Nodemap(this.sourceParent);
            nodemap.run(text.substring(10, text.length));
            nodemap.compile();
            return nodemap.compiledText;
        }
        else
            return text;
    }
}
exports.JsE = JsE;
