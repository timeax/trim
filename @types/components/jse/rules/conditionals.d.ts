import { Compiler } from ".";
import { TrimRule } from "../../../../@types/globals";
export default class Conditions extends Compiler {
    value: any;
    constructor(props: any);
    run(params: string[]): void;
    compile(): string;
    runIf(obj: TrimRule.JsRule): string;
    previous(obj: TrimRule.JsRule): any;
    runElseIf(obj: any): any;
    runElse(obj: TrimRule.JsRule): string;
}
