import { Default } from "@timeax/utilities";
import { TrimRule as Rule } from "../../../@types/globals";
export declare class BaseNode extends Default implements Rule.BaseNode {
    type: Rule.NodeTypes;
    loc?: Rule.SourceLocation;
    range?: [number, number];
    sourceParent: Rule.Program;
    parent: Rule.Parent;
    firstRun: boolean;
    compiler: Rule.Compiler;
    stop?: boolean;
    private _isBlock;
    get isBlock(): boolean;
    set isBlock(value: boolean);
    private _closed;
    get closed(): boolean;
    set closed(value: boolean);
    private _isClosed;
    get isClosed(): boolean;
    set isClosed(value: boolean);
    set __closed(value: boolean);
    private _globalParent;
    get globalParent(): Rule.Program;
    set globalParent(value: Rule.Program);
    private _caller;
    get caller(): Rule.Trim;
    set caller(value: Rule.Trim);
    private _store;
    get store(): number;
    set store(value: number);
    constructor(props: any);
    set sourceChange(value: Rule.Program);
    private _compiledText;
    get compiledText(): string;
    set compiledText(value: string | '***clear!!***');
    set clear(value: boolean);
    close(): void;
    compile(): any;
}
