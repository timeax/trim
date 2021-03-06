import { TrimRule as Rule } from './../../@types/globals.d';
import { Default } from "@timeax/utilities";
import { Program } from './beans/programs';
export declare class TrimBaseClass extends Default {
    parent: Rule.Parent;
    tracker: boolean;
    endCol: number;
    base: string;
    private _element;
    get element(): Rule.Element;
    set element(value: Rule.Element);
    private _path;
    get path(): string;
    set path(value: string);
    private _currentPath;
    get currentPath(): string;
    set currentPath(value: string);
    private _config;
    get config(): Rule.TrimConfig;
    set config(value: Rule.TrimConfig);
    private _component;
    get component(): Rule.Program;
    set component(value: Rule.Program);
    private _current;
    get current(): Rule.Tags;
    set current(value: Rule.Tags);
    set __current(value: Rule.Tags);
    private _line;
    get line(): number;
    set line(value: number);
    createElement(value: Rule.NodeTypes): Rule.Tags;
    private _column;
    get column(): number;
    set column(value: number);
    private _opened;
    get opened(): Array<Rule.Node>;
    set opened(value: Array<Rule.Node>);
    private _builder;
    get builder(): TrimBuilder;
    set builder(value: TrimBuilder);
    private _justClosed;
    get justClosed(): boolean;
    set justClosed(value: boolean);
    private _counter;
    get counter(): number;
    set counter(value: number);
    private _word;
    get word(): string;
    set word(value: string);
    private _isHTML;
    get isHTML(): boolean;
    set isHTML(value: boolean);
    private _isJSE;
    get isJSE(): boolean;
    set isJSE(value: boolean);
    private _store;
    get store(): number;
    set store(value: number);
    private _classes;
    get classes(): Array<{
        name: Rule.Node['type'];
        type: Rule.Tags;
    }>;
    set classes(value: Array<{
        name: Rule.Node['type'];
        type: Rule.Tags;
    }>);
    private _lookout;
    get lookout(): boolean;
    set lookout(value: boolean);
    private _compileType;
    get compileType(): Rule.Program['sourceType'];
    set compileType(value: Rule.Program['sourceType']);
    private _esc;
    get esc(): boolean;
    set esc(value: boolean);
    private _type;
    get type(): CharTypes;
    set type(value: CharTypes);
    private _temp;
    get temp(): string;
    set temp(value: string);
    private _ignoreClose;
    get ignoreClose(): boolean;
    set ignoreClose(value: boolean);
    private _firstRun;
    get firstRun(): boolean;
    set firstRun(value: boolean);
    constructor(props?: Rule.TrimConfig);
    init(): void;
    finish(): void;
    setup(program: Rule.Program, path: string, options: any): void;
    parseName(path: string): Rule.Program['sourceType'];
    getProgram(name: Rule.Program['sourceType']): typeof Program;
    handle(char: string, prevChar?: string): boolean;
    finaliseNode(char: string, current?: any): boolean;
    charTracker(char: string, ignore?: boolean): void;
    parseChar(char: string): void;
    parseCurrent(text: string): boolean;
    parseJsE(char: string, ignore?: any, element?: any): void;
    ignoreNext(char: string, prev?: string): boolean;
    find(node: Rule.NodeTypes, name: string): Rule.Tags;
    set reset(restart: boolean);
    closeText(): void;
    haltProgram(): void;
}
interface TrimBuilder {
    word: string;
    text: string;
    build?: string;
    temp?: string;
    type: string;
    clear: (args?: any) => any;
    clearText: () => any;
    clearBuild: () => any;
}
declare type CharTypes = 'angle-bracket' | 'slash' | 'brace';
export {};
