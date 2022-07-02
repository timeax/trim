import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class Comment extends Element implements TrimRule.Comment {
    value: string;
    type: 'Comment';
    constructor(props: any);
}
