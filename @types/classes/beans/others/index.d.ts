import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class Comment extends Element implements TrimRule.Comment {
    value: string;
    type: 'Comment';
    closeComment: boolean;
    constructor(props: any);
    private _commentType;
    get commentType(): "inline" | "block";
    set commentType(value: "inline" | "block");
}
