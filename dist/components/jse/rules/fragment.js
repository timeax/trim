"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const __1 = require("../../..");
const nodemap_1 = require("../../programs/nodemap");
class Fragment extends _1.Compiler {
    constructor(props) {
        super(props);
        this.rule = props;
        this.isSet = true;
    }
    run() {
        this.rule.compileAsText = true;
        this.rule.close = () => this.close();
        if (this.rule.sourceParent.sourceType !== 'Export')
            throw 'Fragment tag must be used in export tag only...';
    }
    close() {
        this.rule.shut = true;
        const mapper = new nodemap_1.Nodemap(this.rule.sourceParent, new __1.Trim());
        mapper.trim.line = this.rule.loc.start.line;
        mapper.run(this.rule.value, 'ElementMap', this.rule.loc.path);
        this.rule.component = mapper;
    }
}
exports.default = Fragment;
