import { HTML } from '../../../components/html';
import { TrimRule } from "../../../../@types/globals";
export declare class Fragment extends HTML implements TrimRule.Fragment {
    tagName: string;
    isBlock: true;
    htmlType: 'DomElement';
    type: 'Fragment';
    get name(): string;
    get closed(): boolean;
    set closed(value: boolean);
}
