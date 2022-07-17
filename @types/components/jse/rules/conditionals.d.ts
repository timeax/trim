import { Compiler } from ".";
import { TrimRule } from "../../../../@types/globals";
export default class Conditions extends Compiler {
    value: any;
    temp: string;
    constructor(props: any);
    run(params: string[]): void;
    valid(name: string): boolean;
    compile(): string;
    runIf(obj: TrimRule.JsRule): string;
    previous(obj: TrimRule.JsRule): any;
    runElseIf(obj: any): any;
    runElse(obj: TrimRule.JsRule): string;
}
