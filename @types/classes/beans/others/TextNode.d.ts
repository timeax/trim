import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class TextNode extends Element implements TrimRule.TextNode {
    value: string;
    type: 'TextNode';
    constructor(props: any);
    get isClosed(): boolean;
    set isClosed(value: boolean);
    compile(): string;
}
