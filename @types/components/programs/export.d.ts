import { TrimRule } from "../../../@types/globals";
import { Program } from "../../classes/beans/programs";
export declare class Export extends Program implements TrimRule.Export {
    sourceType: 'Export';
    isStrict: true;
    scriptEngine: TrimRule.ScriptEngine;
    private _exports;
    get exports(): Array<TrimRule.Component | TrimRule.WebComponent>;
    set exports(value: Array<TrimRule.Component | TrimRule.WebComponent> | TrimRule.Component | TrimRule.WebComponent);
    constructor(props: any);
    get body(): TrimRule.Node[];
    set body(value: TrimRule.Node[]);
    set reset(value: any);
    compile(): void;
}
