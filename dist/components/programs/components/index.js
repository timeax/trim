"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const utilities_1 = require("@timeax/utilities");
const __1 = require("../../..");
const Components_1 = require("../../../classes/beans/programs/Components");
class Component extends Components_1.ComponentBase {
    constructor(props = new __1.Trim()) {
        super(props);
        this.exportType = 'normal';
        this.isSet = true;
    }
    //@ts-ignore
    get body() {
        //@ts-ignore
        return super.body;
    }
    //@ts-ignore
    set body(value) {
        if (!Array.isArray(value)) {
            if ((0, utilities_1.is)(value.parent).null || (value === null || value === void 0 ? void 0 : value.parent.type) == 'Program') {
                if (value.name !== 'fragment' && value.type !== 'TextNode' && value.type !== 'Comment' && value.type !== 'Script') {
                    if (value.type == 'JsRule') {
                        if (!value.config.isSetter)
                            this.throw('Only setter tags can exist outside the fragment');
                    }
                    else if (value.type !== 'JsE')
                        this.throw('Place tag `' + `${value.type}:${value.loc.start}` + '` in fragment');
                    else if (value.sourceType !== 'script')
                        this.throw('Place tag `' + `${value.type}:${value.loc.start}` + '` in fragment');
                }
                if (value.type === 'TextNode') {
                    if (!(0, utilities_1.isEmpty)(value.value))
                        this.throw('Place tag `' + `${value.type}:${value.loc.start}` + '` in fragment');
                }
                else if (value.type === 'JsRule' && value.name === 'fragment')
                    this.jsRule = value;
            }
        }
        super.body = value;
    }
    get pageComponent() {
        return this.globalParent.pageComponent;
    }
    get basePage() {
        this.scriptEngine.compileId++;
        return this.globalParent.basePage;
    }
    compile() {
        //@ts-ignore
        this.fragment = this.jsRule.component;
        //----
        return this.fragment.compile();
    }
    set exportClose(value) {
        if (value) {
            this.compileScripts();
            this.resolveImportGlobs();
        }
    }
}
exports.Component = Component;
