import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class JsEBase extends Element implements TrimRule.JsE {
    preserveText: boolean;
    stop?: boolean;
    sourceType: "script" | "expression";
    value: string;
    compileId: number;
    type: 'JsE';
    raw: any;
    get isClosed(): boolean;
    set isClosed(value: boolean);
    errorCheck(value: any): boolean;
    lint(): void;
    parseScript(): string;
    constructor(props: any);
}
