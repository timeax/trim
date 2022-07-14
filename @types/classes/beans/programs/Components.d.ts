import { Program } from '.';
import { TrimRule } from '../../../../@types/globals';
export declare class ComponentBase extends Program implements TrimRule.Components {
    exportType: string;
    name: string;
    sourceType: 'Export';
    isStrict: true;
    sourceParent: TrimRule.Export;
    isDefault: boolean;
    private _ref;
    get ref(): string;
    set ref(value: string);
    constructor(props: any);
    set exportClose(value: boolean);
    init(): void;
    setTrimProps(): void;
    set resetExport(value: boolean);
    private _fragment;
    get fragment(): TrimRule.Nodemap;
    set fragment(value: TrimRule.Nodemap);
    private _jsRule;
    get jsRule(): TrimRule.JsRule;
    set jsRule(value: TrimRule.JsRule);
    close(): void;
}
