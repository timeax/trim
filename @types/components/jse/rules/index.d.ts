import { Default } from '@timeax/utilities';
import { TrimRule } from '../../../../@types/globals';
export declare class Compiler extends Default {
    rule: TrimRule.JsRule;
    constructor(props: any);
    init(): void;
    run(...props: any[]): void;
    compile(): string;
    private _path;
    get path(): string;
    set path(value: string);
}
