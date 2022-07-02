import { Program } from ".";
import { TrimRule } from "../../../../@types/globals";
export declare class PageBase extends Program implements TrimRule.Page {
    sourceType: 'Page';
    isStrict: true;
    constructor(props: any, options?: any);
    emit(): void;
    close(): void;
    compile(): void;
}
