"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utilities_1 = require("@timeax/utilities");
const eslint_1 = require("eslint");
const extract_1 = __importDefault(require("./func/extract"));
const extractExp_1 = __importStar(require("./func/extractExp"));
const parseImport_1 = __importDefault(require("./func/parseImport"));
const parseJse_1 = __importDefault(require("./func/parseJse"));
const parsejsx_1 = __importDefault(require("./func/parsejsx"));
class CodeLinter extends utilities_1.Default {
    constructor() {
        super();
        this._linter = new eslint_1.Linter();
        this.isSet = true;
    }
    get linter() {
        return this._linter;
    }
    set linter(value) {
        this._linter = value;
    }
    static parseImportStatement(src, obj = new CodeLinter()) {
        return (0, parseImport_1.default)(src, obj.linter);
    }
    static jsxLinter(src, obj = new CodeLinter()) {
        return (0, parsejsx_1.default)(src, obj.linter);
    }
    static parseJsE(src, env, obj = new CodeLinter()) {
        return (0, parseJse_1.default)(src, env, obj.linter);
    }
    static extractExpression(src, obj = new CodeLinter()) {
        return (0, extractExp_1.default)(src, obj.linter);
    }
    static parseExpression(src, obj = new CodeLinter()) {
        return (0, extractExp_1.expressionLinter)(src, obj.linter);
    }
    static parseScript(src, options, obj = new CodeLinter()) {
        return (0, extract_1.default)(src, obj.linter, options);
    }
    static lintText(src) {
        let valid = true;
        (0, utilities_1.avoid)(err => (0, extract_1.default)(src)).then(err => valid = !err);
        return valid;
    }
}
exports.default = CodeLinter;
CodeLinter.report = (context, fix, node, msg = 'Fix the error') => {
    context.report({
        node,
        message: msg,
        //@ts-ignore
        fix: (fixer) => fix(fixer)
    });
};
CodeLinter.reportErr = (context, node, msg = 'Fix the error') => {
    context.report({
        node,
        message: msg,
    });
};
