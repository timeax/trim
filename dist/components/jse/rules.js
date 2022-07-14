"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsRule = void 0;
const utilities_1 = require("@timeax/utilities");
const element_1 = require("../../classes/beans/element");
const jse_config_json_1 = __importDefault(require("../../conf/rules/jse.config.json"));
class JsRule extends element_1.Parent {
    constructor(props) {
        super(props);
        this.type = 'JsRule';
        this.value = '';
        this.props = '';
        this._stop = false;
        this.isSet = true;
    }
    //@ts-ignore
    get stop() {
        return this._stop;
    }
    set stop(value) {
        this._stop = value;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        this._config = value;
        if ((0, utilities_1.is)(this.config).null)
            throw 'No rule with name `' + this.name + '` found';
    }
    run() {
        this.isBlock = this.config.isBlock;
        const compiler = require(utilities_1.Fs.join(__dirname, utilities_1.Fs.join('../../conf/rules/', this.config.path))).default;
        this.compiler = new compiler(this);
        this.compiler.run(this.params, this.value.trim().substring(this.name.length, this.value.length));
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
        this.config = jse_config_json_1.default.find(file => file.name === this.name);
    }
    get isClosed() {
        return super.isClosed;
    }
    set isClosed(value) {
        if (value && this.isClosed)
            return;
        //-----
        if (value)
            this.run();
        //-----
        super.isClosed = value;
    }
    compile() {
        return this.compiler.compile();
    }
}
exports.JsRule = JsRule;
