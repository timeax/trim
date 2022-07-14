import { Compiler } from ".";
import { TrimRule } from "../../../../@types/globals";
export default class Use extends Compiler {
    imports: {
        local: string;
        name: string;
        default: boolean;
    }[];
    constructor(props: any);
    run(param?: string[]): void;
    load(): void;
    get path(): any;
    set path(value: any);
    get pageExport(): TrimRule.Export;
}
