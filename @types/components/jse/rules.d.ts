import { TrimRule } from '../../../@types/globals';
import { Parent } from '../../classes/beans/element';
export declare class JsRule extends Parent implements TrimRule.JsRule {
    params: string[];
    type: 'JsRule';
    value: string;
    component: TrimRule.Program;
    props: string;
    constructor(props: any);
    private _stop?;
    get stop(): boolean;
    set stop(value: boolean);
    private _config;
    get config(): TrimRule.JsRuleConfig;
    set config(value: TrimRule.JsRuleConfig);
    run(): void;
    private _name;
    get name(): string;
    set name(value: string);
    get isClosed(): boolean;
    set isClosed(value: boolean);
    compile(): string;
}
