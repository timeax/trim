"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleLoader = void 0;
const pirates_1 = require("pirates");
const linter_1 = __importDefault(require("../../classes/util/linter"));
function moduleLoader(path) {
    function matcher(name) {
        return true;
    }
    return (0, pirates_1.addHook)((code, name) => linter_1.default.jsxLinter(code, { wrapper: 'func', path: path }).verify(), { exts: ['.js'] });
}
exports.moduleLoader = moduleLoader;
