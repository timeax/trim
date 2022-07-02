import { TrimRule } from "../../../../@types/globals";
import { Parent } from "../element";
export declare class HTMLBase extends Parent implements TrimRule.HTML {
    preserveText: boolean;
    type: 'HTML';
    htmlType: "Custom" | "DOMElement" | "Component";
    lookup: boolean;
    words: string;
    private _name;
    get name(): string;
    set name(value: string);
    private _attributes;
    get attributes(): TrimRule.Attributes[];
    set attributes(value: TrimRule.Attributes[] | TrimRule.Attributes);
    private _attr;
    get attr(): TrimRule.Attributes;
    set attr(value: TrimRule.Attributes);
    private _config;
    get config(): TrimRule.DomConfig;
    set config(value: TrimRule.DomConfig);
    set sourceChange(value: TrimRule.Program);
    resolvePath(): void;
    parseAttr(char: string): void;
    closing(char: string): boolean;
    end(): void;
    constructor(props: any);
}
