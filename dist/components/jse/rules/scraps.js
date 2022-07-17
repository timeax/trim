"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const _1 = require(".");
const __1 = require("../../..");
const extract_1 = require("../../../classes/util/extract");
const linter_1 = __importDefault(require("../../../classes/util/linter"));
const nodemap_1 = require("../../programs/nodemap");
const scraps_1 = require("../../programs/scraps");
class ScrapsRule extends _1.Compiler {
    constructor(props) {
        super(props);
        this.props = '';
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        let src, close, props;
        if (params.length > 3 || params.length < 1)
            throw `Expected 2 or 3 parameters, but found ${params.length}`;
        params.forEach(param => {
            const extract = linter_1.default.extractExpression(param)[0];
            if (extract.type === 'Literal') {
                if (params.length === 1)
                    src = eval(extract.src);
                else if ((0, utilities_1.is)(close).null && (0, utilities_1.is)(src).null && (0, utilities_1.is)(props).null)
                    src = eval(extract.src);
                else
                    throw `Unexpected literal '${extract.src}'`;
            }
            else if (extract.type === 'AssignmentExpression') {
                if (extract.src.trim().startsWith('props')) {
                    const right = linter_1.default.parseExpression(extract.src).output.split('=')[1];
                    props = right;
                }
                else
                    eval(extract.src);
            }
            else
                throw 'Expected Literal or AssignmentExpression but found ' + extract.type;
        });
        if ((0, utilities_1.isEmpty)(src))
            throw `Unset parameter 'path' in Scraps`;
        this.props = typeof props == 'string' ? props : '';
        this.src = utilities_1.Fs.join(utilities_1.Fs.dirname(this.rule.loc.path), src);
        this.restLoc = close ? this.setSrc(utilities_1.Fs.join(utilities_1.Fs.dirname(this.rule.loc.path), close)) : '';
        this.rule.close = () => this.close();
    }
    close() {
        this.rule.shut = true;
        const mapper = new nodemap_1.Nodemap(this.rule.sourceParent);
        //@ts-ignore
        mapper.body = this.rule.children;
        this.rule.children.forEach(child => child.sourceChange = mapper);
        const scraps = new scraps_1.Scraps(new __1.Trim(), { children: mapper, end: this.restLoc, start: this.path, sourceParent: this.rule.sourceParent });
        this.compile = () => {
            scraps.props = (0, extract_1._call)(this.rule.sourceParent.globals, this.props);
            return scraps.compile();
        };
        //@ts-ignore
        this.rule.sourceParent.imports = scraps;
        scraps.run();
    }
    get path() {
        return super.path;
    }
    set path(value) {
        super.path = value;
        if (!utilities_1.Fs.name(value).startsWith('_'))
            this.rule.throw('Filename must begin with an underscore..', 'FileNameError');
    }
}
exports.default = ScrapsRule;
