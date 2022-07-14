import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class Script extends Element implements TrimRule.Script {
    value: string;
    type: 'Script';
    name: 'Script';
    private _compileId;
    get compileId(): number;
    set compileId(value: number);
    constructor(props: any);
    get isClosed(): boolean;
    set isClosed(value: boolean);
}
