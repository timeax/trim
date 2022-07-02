"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const __1 = require("..");
const components_1 = require("../../../programs/components");
class ExportRule extends __1.Compiler {
    constructor(props) {
        super(props);
        this.type = 'normal';
        this.rule = props;
        this.isSet = true;
    }
    run(params) {
        params = params.map(item => item.trim());
        if (params.length < 1)
            throw 'Expected parameters in export rule';
        if (params.length > 2)
            throw 'Expected 1 or 2 params, found three on export rule';
        const call = (prop = '') => {
            if (prop.includes('=')) {
                const [key, value] = prop['split']('=').map(item => item.trim());
                this[key] = value;
            }
            else if (params.length > 1)
                throw `Unexpected string '${prop}'`;
            else
                this.name = prop;
        };
        params.forEach(param => call(param));
        if ((0, utilities_1.isEmpty)(this.name))
            throw 'Export must have a name';
        else if (this.type !== 'normal' && this.type !== 'web')
            throw 'Export type must be either `web or normal`';
        this.rule.compileAsText = true;
        this.rule.close = () => this.close();
    }
    close() {
        this.rule.shut = true;
        const mapper = new components_1.Component();
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
