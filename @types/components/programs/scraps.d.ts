import { TrimRule } from "../../../@types/globals";
import { Program } from "../../classes/beans/programs";
import { ScriptEngine } from "../../classes/beans/programs/scriptEngine";
export declare class Scraps extends Program implements TrimRule.Scraps {
    restLoc: string;
    sourceType: 'Scraps';
    isStrict: true;
    nodes: TrimRule.Nodemap;
    scriptEngine: ScriptEngine;
    constructor(props: any, options: TrimRule.ScrapsOptions);
    set options(opts: TrimRule.ScrapsOptions);
    get body(): TrimRule.Node[];
    set body(value: TrimRule.Node[]);
    close(run?: boolean): void;
    run(): void;
    compile(): string;
    finish(): void;
}
