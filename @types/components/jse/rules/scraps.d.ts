import { Compiler } from ".";
import { TrimRule } from '../../../../@types/globals';
export default class ScrapsRule extends Compiler {
    restLoc: string;
    scraps: TrimRule.Scraps;
    constructor(props: any);
    run(params: string[]): void;
    close(): void;
    get path(): any;
    set path(value: any);
}
