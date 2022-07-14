"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const utilities_1 = require("@timeax/utilities");
const Page_1 = require("./../../classes/beans/programs/Page");
class Page extends Page_1.PageBase {
    constructor(props, parent) {
        super(props, parent);
        this.isSet = true;
    }
    emit() {
        var _a;
        let obj = (_a = this.trim.config) === null || _a === void 0 ? void 0 : _a.compilerOptions;
        //@ts-ignore
        const { outFile, outDir, extensionPrefix, compileExtension } = !(0, utilities_1.is)(obj).null ? obj : {};
        if ((0, utilities_1.isEmpty)(outFile) && (0, utilities_1.isEmpty)(outDir))
            return console.log(this.compiledText, '-----');
        if ((0, utilities_1.isEmpty)(outDir)) {
            utilities_1.Fs.write(outFile, this.compiledText);
        }
        else {
            const src = utilities_1.Fs.formatPath(this.path).replace(utilities_1.Fs.formatPath(this.trim.base), '.');
            const mainFolder = utilities_1.Fs.join(this.trim.base, outDir);
            //-----
            const file = utilities_1.Fs.join(mainFolder, (src.replace(utilities_1.Fs.ext(src), extensionPrefix + compileExtension)));
            utilities_1.Fs.createDirs(file);
            utilities_1.Fs.write(file, this.compiledText);
        }
    }
}
exports.Page = Page;
