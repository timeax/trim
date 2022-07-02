import { TrimRule } from '../../../@types/globals';
import { NodemapBase } from "../../classes/beans/programs/Nodemap";
export declare class Nodemap extends NodemapBase {
    engine: TrimRule.ScriptEngine;
    constructor(parent?: any, props?: any);
    run(text: string, type?: "NameMap" | "ElementMap", path?: string): boolean;
    map(char: string): boolean;
    close(): void;
    get rerun(): boolean;
    set rerun(value: boolean);
    compile(run?: boolean, engine?: TrimRule.ScriptEngine): string;
}
