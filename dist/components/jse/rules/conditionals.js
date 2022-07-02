"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const extract_1 = require("../../../classes/util/extract");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
class Conditions extends _1.Compiler {
    constructor(props) {
        super(props);
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        if (this.rule.name !== 'else' && this.rule.name !== 'condition')
            if (params.length > 1 || params.length < 1)
                throw 'Expected 1 parameter, found ' + params.length;
        const value = params[0];
        if (this.rule.name !== 'else' && this.rule.name !== 'condition')
            this.value = linter_1.default.parseExpression(value).output;
    }
    compile() {
        const { rule: { self, name } } = this;
        let text = '';
        switch (name) {
            case 'if':
                //@ts-ignore
                text = this.runIf(self);
                break;
            case 'elseif':
                text = this.runElseIf(self);
                break;
            case 'else':
                text = this.runElse(self);
                break;
            default:
                text = self.children.map(item => item.compiler.compile()).join('');
                break;
        }
        return text;
    }
    runIf(obj) {
        if ((0, utilities_1.isEmpty)(this.value))
            throw 'Expected expression.. found nothing';
        if (obj.parent.type === 'JsRule' && obj.parent.name === 'condition') {
            obj.parent.booleanValue = (0, extract_1._call)(obj.sourceParent.globals, this.value);
            if (obj.parentNode.booleanValue) {
                return obj.children.map(item => item.compiler.compile()).join('');
            }
        }
        else {
            if ((0, extract_1._call)(obj.sourceParent.globals, this.value))
                return obj.children.map(item => item.compiler.compile()).join('');
        }
        return '';
    }
    previous(obj) {
        const index = obj.parentNode.children.findIndex(item => item === obj);
        if (index == 0)
            throw `Cannot use 'else' without an if statement`;
        return obj.parentNode.children[index - 1];
    }
    runElseIf(obj) {
        if (obj.parent.type === 'JsRule' && obj.parentNode.name === 'condition') {
            const prev = this.previous(obj);
            if ((0, utilities_1.is)(prev).null)
                throw `Cannot use 'else' without an if statement`;
            else if (prev.name !== 'if')
                throw `Cannot use 'else' without an if statement`;
            if (obj.parentNode.booleanValue)
                '';
            else {
                if ((0, utilities_1.isEmpty)(this.value))
                    throw 'Expected expression.. found nothing';
                obj.parentNode.booleanValue = (0, extract_1._call)(obj.sourceParent.globals, this.value);
                if (obj.parentNode.booleanValue)
                    return obj.children.map(item => item.compiler.compile()).join('');
            }
        }
        else
            throw 'Unexpected else if statement';
        return '';
    }
    runElse(obj) {
        if (obj.parent.type === 'JsRule' && obj.parentNode.name === 'condition') {
            const prev = this.previous(obj);
            if ((0, utilities_1.is)(prev).null)
                throw `Cannot use 'else' without an if statement`;
            else if (prev.name !== 'if')
                throw `Cannot use 'else' without an if statement`;
            if (obj.parent.booleanValue)
                '';
            else
                return obj.children.map(item => item.compiler.compile()).join('');
        }
        else
            throw 'Unexpected else statement';
        return '';
    }
}
exports.default = Conditions;
