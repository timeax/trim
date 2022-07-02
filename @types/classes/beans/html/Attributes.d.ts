import { BaseNode } from '..';
import { TrimRule } from '../../../../@types/globals';
export declare class AttributeBase extends BaseNode implements TrimRule.Attributes {
    raw: any;
    type: 'Attributes';
    quotes: {
        type: string;
        count: number;
        uses: boolean;
    };
    valueType: 'string' | 'JsE';
    compiledName: string;
    compiledValue: string;
    stop?: boolean;
    started: boolean;
    prev: string;
    caller: TrimRule.HTML;
    temp: string;
    name: TrimRule.Nodemap;
    constructor(props: any);
    init(): void;
    private _value;
    get value(): TrimRule.AttrValue;
    set value(value: TrimRule.AttrValue);
    private _char;
    get char(): string;
    set char(value: string);
    setJsValue(value: string): void;
    setString(value: string, skip?: boolean): string;
    set sourceChange(value: TrimRule.Program);
    close(): void;
    get closed(): boolean;
    set closed(value: boolean);
    get isClosed(): boolean;
    set isClosed(value: boolean);
}
