"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemap_1 = require("./../../programs/nodemap");
const _1 = require(".");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
const extract_1 = require("../../../classes/util/extract");
const uuid_1 = require("uuid");
class Loops extends _1.Compiler {
    constructor(props) {
        super(props);
        this.arr = '';
        this.rule = props;
        this.isSet = true;
    }
    run(param) {
        const props = param[0].trim().split(/\s+/g);
        if (param.length > 1 || param.length < 1 || props.length < 3 || props.length > 3)
            throw `Please check '@each loop' (${param[0]})`;
        if (props[1] === 'in' || props[1] === 'of') {
            this.operand = props[1];
            const extract = linter_1.default.extractExpression(props[0]);
            if (extract[0].type == 'Identifier')
                this.key = extract[0].src;
            else
                throw `Expected Identifier found '${extract[0].type}' at '${extract[0].src}'`;
            this.key = props[0];
            this.arr = linter_1.default.parseExpression(props[2]).output;
            this.rule.close = () => this.close();
        }
        else
            throw `please check '${param[0]}'`;
    }
    close() {
        this.rule.shut = true;
        const mapper = new nodemap_1.Nodemap(this.rule.sourceParent);
        //@ts-ignore
        mapper.body = this.rule.children;
        this.rule.children.forEach(item => item.sourceChange = mapper);
        this.component = mapper;
    }
    get object() {
        return this._object;
    }
    set object(value) {
        this._object = value;
    }
    compile() {
        this.object = (0, extract_1._call)(this.rule.sourceParent.globals, this.arr);
        this.component.__globals = this.rule.sourceParent.globals;
        this.rule.clear = true;
        if (Array.isArray(this.object)) {
            for (const key in this.object) {
                if (Object.prototype.hasOwnProperty.call(this.object, key)) {
                    const element = this.object[key];
                    const engine = this.rule.sourceParent.scriptEngine.clone;
                    if (this.operand === 'in')
                        this.component.globals[this.key] = key;
                    else
                        this.component.globals[this.key] = element;
                    let id = (0, uuid_1.v4)();
                    engine.__env = { id: id, name: this.key, type: 'const' };
                    this.rule.compiledText = this.component.compile(false, engine);
                    engine.compileId++;
                }
            }
        }
        else
            throw `'${this.arr.substring(3, this.arr.length)}' is not iterable`;
        return this.rule.compiledText;
    }
}
exports.default = Loops;
