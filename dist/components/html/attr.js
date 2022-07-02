"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attributes = void 0;
const utilities_1 = require("@timeax/utilities");
const Attributes_1 = require("../../classes/beans/html/Attributes");
class Attributes extends Attributes_1.AttributeBase {
    constructor(props) {
        super(props);
        this.raw = '';
        this.isSet = true;
    }
    compile() {
        var _a;
        this.clear = true;
        this.compiledName = this.name.compile();
        if (this.compiledName.startsWith('.')) {
            const name = this.compiledName.substring(1, this.compiledName.length);
            this.compiledName = `x-${name}`;
        }
        this.compiledText = this.compiledName;
        if (((_a = this.value) === null || _a === void 0 ? void 0 : _a.type) === 'JsE') {
            this.compiledValue = this.value.compile();
            this.raw = this.value.raw;
            this.compiledText = `="${this.compiledValue}"`;
        }
        else if (!(0, utilities_1.isEmpty)(this.value))
            this.compiledValue = this.value, this.raw = this.value, this.compiledText = `="${this.compiledValue}"`;
        return this.compiledText;
    }
}
exports.Attributes = Attributes;
