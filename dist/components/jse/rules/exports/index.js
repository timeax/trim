"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const __1 = require("..");
const components_1 = require("../../../programs/components");
const parser_1 = __importDefault(require("../../../util/parser"));
class ExportRule extends __1.Compiler {
    constructor(props) {
        super(props);
        this.type = 'normal';
        this.default = false;
        this.rule = props;
        this.isSet = true;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        if (value === 'default')
            this.default = true;
    }
    run(params = ['']) {
        params = params.map(item => item.trim());
        if (params.length > 2)
            throw `Expected 1 or 2 params, found ${params.length} on export rule`;
        const call = (prop = '') => {
            if (prop.includes('=')) {
                const [key, value] = prop['split']('=').map(item => item.trim());
                this[key] = parser_1.default.isQuote(value.charAt(0)) ? eval(value) : value;
            }
            else if (params.length > 1)
                throw `Unexpected string '${prop}'`;
            else
                this.name = prop;
        };
        params.forEach(param => call(param));
        if ((0, utilities_1.isEmpty)(this.name))
            this.name = 'default';
        else if (!parser_1.default.isCaped(this.name.trim().charAt(0)))
            this.throw(`Export name '${this.name}' must begin with a capital letter`, 'NameError');
        if (this.type !== 'normal' && this.type !== 'web')
            throw 'Export type must be either `web or normal`';
        this.rule.compileAsText = true;
        this.rule.close = () => this.close();
    }
    close() {
        this.rule.shut = true;
        const mapper = new components_1.Component();
        mapper.isDefault = this.default;
        //@ts-ignore
        mapper.sourceParent = this.rule.sourceParent;
        mapper.path = this.rule.loc.path;
        mapper.trim.line = this.rule.loc.start.line;
        //@ts-ignore
        mapper.trim.programRun(mapper, this.rule.value, this.rule.loc.path);
        //@ts-ignore
        const { sourceType, self } = this.rule.sourceParent;
        if (sourceType !== 'Export')
            throw 'Export component can only exist in export files';
        mapper.name = this.name;
        //@ts-ignore
        self.exports = mapper;
    }
}
exports.default = ExportRule;
