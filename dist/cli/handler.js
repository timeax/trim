"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actions = void 0;
const utilities_1 = require("@timeax/utilities");
const glob_array_1 = __importDefault(require("glob-array"));
const glob_1 = require("glob");
const readline_1 = __importDefault(require("readline"));
const __1 = require("..");
const nodemap_1 = require("../components/programs/nodemap");
//----> global objects
global.Exports = [];
global.jsImports = [];
global.nodeMapper = nodemap_1.Nodemap;
global.avoid = (arg) => {
    let result = undefined;
    try {
        result = arg();
    }
    catch (error) { }
    return result;
};
global.Fs = utilities_1.Fs;
global.is = utilities_1.is;
//---
process.on('unhandledRejection', err => console.log(err));
//--------------
class Actions extends utilities_1.Default {
    constructor(props) {
        super(props);
        this.includes = [];
        this.excludes = [];
        this.compileables = [];
        this._config = require('../conf/trim.config.json');
        this.watcher = null;
        this._settings = this.config;
        this.isSet = true;
    }
    get config() {
        return this._config;
    }
    set config(value) {
        throw 'Access denied';
    }
    get path() {
        return this._path;
    }
    set path(value) {
        this._path = value;
        if (this.command === 'watchFolder')
            if (!this.hasConfig)
                throw ('Couldn\'t find config file in ' + this.path);
    }
    get settings() {
        if (utilities_1.Fs.exists(utilities_1.Fs.join(this.path, 'trim.config.json'))) {
            this._settings = JSON.parse(utilities_1.Fs.content(utilities_1.Fs.join(this.path, 'trim.config.json')));
        }
        else
            throw 'No config file found';
        return this._settings;
    }
    createConfig(path) {
        const file = utilities_1.Fs.join(path, 'trim.config.json');
        if (utilities_1.Fs.exists(file))
            return console.log('Config file already exists...');
        utilities_1.Fs.write(file, JSON.stringify(this.config), () => {
            if (utilities_1.Fs.exists(file))
                this.msg = 'Sucessfully created config file';
        });
    }
    runFile(from, to) {
        const base = process.cwd();
        const [start, end] = [from, to].map((item, index) => {
            let path = item;
            if (item.startsWith('.') || item.startsWith('/'))
                path = utilities_1.Fs.join(base, item);
            if (index === 0 && !utilities_1.Fs.exists(path))
                throw `Path '${path}' does not exist`;
            return path;
        });
        this.config.compilerOptions.outFile = end;
        const trim = new __1.Trim(this.config);
        trim.run(start);
    }
    watchFolder(path) {
        this.command = 'watchFolder';
        this.path = path;
        //---
        if (!(0, utilities_1.is)(this.watcher).null)
            this.watcher.close(), this.watcher = null;
        //--
        const compilers = [];
        const watcher = utilities_1.Fs.watch2(this.path, { ignoreInitial: true });
        watcher.on('add', (file) => this.compileFolder(compilers, file, 'add')).on('error', (err) => console.log(err));
        watcher.on('change', (file) => this.compileFolder(compilers, file, 'change')).on('error', (err) => console.log(err));
        ;
        watcher.on('unlink', (file) => this.compileFolder(compilers, file, 'delete')).on('error', (err) => console.log(err));
        ;
        this.watcher = watcher;
        setTimeout(() => this.compileFolder(compilers), 1000);
    }
    get hasConfig() {
        const has = utilities_1.Fs.exists(utilities_1.Fs.join(this.path, 'trim.config.json'));
        if (has) {
            if (this.command == 'watchFolder') {
                let htmFiles = glob_1.glob.sync("**/*.trim", { absolute: true });
                if (this.settings.compilerOptions.allowHTM) {
                    htmFiles = [...htmFiles, glob_1.glob.sync("**/*.htm", { absolute: true })];
                }
                this.includes = glob_array_1.default.sync(this.settings.include, { absolute: true });
                this.excludes = glob_array_1.default.sync(this.settings.exclude, { absolute: true });
                let filtered = htmFiles.filter(path => !this.excludes.includes(path));
                this.includes
                    .filter(path => !this.excludes.includes(path))
                    .filter(path => !filtered.includes(path))
                    .forEach(item => filtered.push(item));
                this.compileables = filtered.filter(item => !(utilities_1.Fs.name(item).startsWith('_'))).map(item => utilities_1.Fs.formatPath(item));
            }
        }
        return has;
    }
    get stamp() {
        return `[ ${new Date().toTimeString().match(/\d+:\d+:\d+/g)[0]} ]`;
    }
    findImports(compilers, path, store = [], search = null) {
        const call = (value) => {
            if (utilities_1.Fs.samePath(value.path, path))
                store.push(value);
            else if (value.sourceType === 'Scraps' && utilities_1.Fs.samePath(value.restLoc, path))
                store.push(value);
            if (value.imports.length > 0)
                this.findImports(compilers, path, store, value);
        };
        if (search)
            search.imports.forEach(value => call(value));
        else
            compilers.forEach(compiler => compiler.component.imports.forEach(value => call(value)));
    }
    findAssets(compilers, path, store = [], search = null) {
        const call = (value, program) => {
            if (utilities_1.Fs.samePath(value, path))
                store.push(program); //@ts-ignore
            else if (program.imports.length > 0)
                program.imports.forEach(program => this.findAssets(compilers, path, store, program));
        };
        if (search)
            search.assets.forEach(value => call(value, search));
        else
            compilers.forEach(compiler => {
                const { assets, self: program } = compiler.component;
                if (assets.length > 0)
                    assets.forEach(value => call(value, program)); //@ts-ignore
                else if (program.imports.length > 0)
                    program.imports.forEach(program => this.findAssets(compilers, path, store, program));
            });
    }
    clear() {
        process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");
        console.clear();
        const blank = '\n'.repeat(process.stdout.rows);
        console.log(blank);
        readline_1.default.cursorTo(process.stdout, 0, 0);
        readline_1.default.clearScreenDown(process.stdout);
        // process.stdout.write('\033c');
    }
    compileFolder(compilers, path = '', type = 'initial') {
        this.clear();
        this.msg = 'File change detected. Starting incremental compilation...';
        //--
        const create = (item) => {
            if (utilities_1.Fs.ext(item) === '.trim' || (this.settings.compilerOptions.allowHTM && utilities_1.Fs.ext(item) === '.htm')) {
                const trim = new __1.Trim(this.settings);
                trim.base = this.path;
                trim.run(item);
                compilers.push(trim);
            }
        };
        //--
        switch (type) {
            case 'add':
                if (this.isPage(path))
                    create(path);
                break;
            case 'delete':
                this.onDelete(path, compilers);
                break;
            case 'change':
                const trim = compilers.find(item => utilities_1.Fs.samePath(item.currentPath, path));
                if ((0, utilities_1.is)(trim).notNull)
                    trim.rerun(), this.msg = 'Recompiled ' + utilities_1.Fs.name(path);
                else
                    this.onChange(path, compilers);
                break;
            case 'initial':
                this.clear();
                if (compilers.length === 0)
                    this.msg = 'Started Compilation';
                else
                    this.msg = 'Restarting Compilation', compilers = [];
                this.compileables.forEach(item => create(item));
                break;
        }
        this.msg = 'Found 0 errors. Watching for file changes';
    }
    onDelete(path, compilers) {
        compilers.forEach(item => item.rerun());
    }
    isPage(path) {
        return !utilities_1.Fs.name(path).startsWith('_');
    }
    onChange(path, compilers) {
        if (utilities_1.Fs.name(path) === 'trim.config.json')
            return this.watchFolder(this.path);
        //-- check exports 
        const obj = global.Exports.find(item => utilities_1.Fs.samePath(path, item.path));
        if (!(0, utilities_1.is)(obj).null)
            obj.program.rerun = true;
        const programs = [];
        //@ts-ignore
        if (utilities_1.Fs.ext(path) === '.trim' || (this.settings.compilerOptions.allowHTM && utilities_1.Fs.ext(path) === '.htm'))
            this.findImports(compilers, path, programs);
        else
            this.findAssets(compilers, path, programs), this.xcache = path;
        //-----
        programs.forEach(program => program.rerun = true);
    }
    set msg(value) {
        console.log(`${this.stamp} ${value}...\n`);
    }
    set xcache(value) {
        if (utilities_1.Fs.ext(value) === '.js')
            delete require.cache[value];
    }
}
exports.Actions = Actions;
