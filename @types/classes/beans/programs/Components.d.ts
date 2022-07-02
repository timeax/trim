import { Program } from '.';
import { TrimRule } from '../../../../@types/globals';
export declare class ComponentBase extends Program {
    exportType: string;
    name: string;
    sourceType: 'Export';
    isStrict: true;
    sourceParent: TrimRule.Export;
    private _ref;
    get ref(): string;
    set ref(value: string);
    constructor(props: any);
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
