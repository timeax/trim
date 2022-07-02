import { TrimRule } from '../../../@types/globals';
import { HTMLBase } from './../../classes/beans/html/index';
export declare class HTML extends HTMLBase {
    constructor(props: any);
    private _nameMap;
    get nameMap(): TrimRule.Nodemap;
    set nameMap(value: TrimRule.Nodemap);
    parseAttr(char: string): void;
    compile(): string;
    customLoader(): void;
    componentLoader(): void;
    domLoader(): void;
}
