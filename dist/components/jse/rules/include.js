"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const __1 = require("../../..");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
const Include_1 = require("../../programs/Include");
class Includer extends _1.Compiler {
    constructor(props) {
        super(props);
        this.strict = false;
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        let src, isStrict;
        if (params.length > 2 || params.length < 1)
            throw 'Expected 1 or 2 arguments but found ' + params.length;
        params.forEach(param => {
            const extract = linter_1.default.extractExpression(param)[0];
            if (extract.type === 'Literal') {
                const value = eval(extract.src);
                if (params.length === 1) {
                    if (typeof value !== 'string')
                        throw 'Path variable for include not found';
                    src = value;
                }
                else {
                    if (typeof value == 'string')
                        src = value;
                    else if (typeof value == 'boolean')
                        isStrict = value;
                    else
                        throw `Unexpected literal type '${typeof value}'`;
                }
            }
            else if (extract.type === 'AssignmentExpression')
                eval(extract.src);
            else
                throw 'Expected Literal or AssignmentExpression but found ' + extract.type;
        });
        this.strict = isStrict && true;
        if ((0, utilities_1.is)(src).null)
            throw 'Path variable for include not found';
        this.src = utilities_1.Fs.join(utilities_1.Fs.dirname(this.rule.loc.path), src);
        this.include();
    }
    include() {
        const mapper = new Include_1.Include(new __1.Trim(), { sourceParent: this.rule.sourceParent });
        mapper.parentNode = this.rule.parent;
        mapper.isStrict = this.strict;
        mapper.path = this.path;
        mapper.run();
        this.rule.component = mapper;
        if (mapper.ext === '.htm')
            this.rule.sourceParent.imports = mapper;
        else
            this.rule.sourceParent.assets = mapper.path;
    }
}
exports.default = Includer;
