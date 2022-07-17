import { BaseNode } from ".";
import { TrimRule } from "../../../@types/globals";
export declare class Element extends BaseNode implements TrimRule.Element {
    isUseless: boolean;
    preserveText: boolean;
    private _temp;
    get temp(): string;
    set temp(value: string);
    get isClosed(): boolean;
    set isClosed(value: boolean);
    private _parent;
    get parent(): TrimRule.Parent;
    set parent(value: TrimRule.Parent);
    private _compileAsText;
    get compileAsText(): any;
    set compileAsText(value: any);
    set sourceChange(value: TrimRule.Program);
    close(): void;
    set shut(v: boolean);
    private set __close(value);
    constructor(props: any);
}
export declare class Parent extends Element implements TrimRule.Parent {
    private _children;
    get name(): string;
    set name(value: string);
    get children(): TrimRule.ChildNodes;
    childTest(child: any): {
        msg: string;
        valid: boolean;
    };
    set sourceChange(value: TrimRule.Program);
    set children(value: TrimRule.ChildNodes | TrimRule.Tags);
}
