import { BaseNode } from "..";
import { Trim } from "../../..";
import { TrimRule } from "../../../../@types/globals";
export declare class Program extends BaseNode implements TrimRule.Programs {
    sourceType: TrimRule.Program['sourceType'];
    scriptEngine: TrimRule.ScriptEngine;
    type: 'Program';
    scriptCount: number;
    trim: Trim;
    isStrict: boolean;
    stop?: boolean;
    private _path;
    get path(): string;
    set path(value: string);
    protected _body: TrimRule.Node[];
    hasSet: boolean;
    get body(): TrimRule.Node[];
    set body(value: TrimRule.Node[] | TrimRule.Tags);
    private _parent;
    get parent(): TrimRule.Parent;
    set parent(value: TrimRule.Parent);
    private _imports;
    get imports(): TrimRule.Imports[];
    set imports(value: Array<TrimRule.Imports> | TrimRule.Imports);
    private _assets;
    get assets(): string[];
    set assets(value: string | string[]);
    private _scripts;
    get scripts(): Array<TrimRule.Script>;
    set scripts(value: Array<TrimRule.Script> | TrimRule.Script);
    close(): void;
    set sourceChange(value: TrimRule.Program);
    compileScripts(): void;
    setGlobals(): void;
    resolveImportGlobs(): void;
    private _globals;
    get globals(): TrimRule.Globals;
    set globals(value: TrimRule.env);
    set __globals(value: object);
    compile(): any;
    private _props;
    get props(): TrimRule.Props;
    set props(value: TrimRule.Props);
    private _recompile;
    get recompile(): boolean;
    set recompile(value: boolean);
    get pageComponent(): TrimRule.Page;
    private _rerun;
    get rerun(): boolean;
    set rerun(value: boolean);
    set reset(value: boolean);
    optionsSettings(options: TrimRule.ProgramOptions): void;
    constructor(trim: TrimRule.Trim, options?: TrimRule.ProgramOptions);
}