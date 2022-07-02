import { Program } from ".";
import { TrimRule } from "../../../../@types/globals";
export declare class NodemapBase extends Program implements TrimRule.Nodemap {
    nodeType: "NameMap" | "ElementMap";
    stop?: boolean;
    sourceType: 'NodeMap';
    isStrict: false;
    constructor(parent?: TrimRule.Program, props?: TrimRule.Trim);
    setParsers(trim: TrimRule.Trim): void;
    get body(): Array<TrimRule.Element>;
    set body(value: TrimRule.Node);
    handle(char: string, prevChar?: string): boolean;
    isValid(char: string): boolean;
    parseText(char: string): boolean;
}
