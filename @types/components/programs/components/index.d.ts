import { TrimRule } from "../../../../@types/globals";
import { ComponentBase } from "../../../classes/beans/programs/Components";
export declare class Component extends ComponentBase implements TrimRule.Component {
    exportType: "normal";
    constructor(props?: TrimRule.Trim);
    get body(): TrimRule.ChildNodes | TrimRule.Tags;
    set body(value: TrimRule.ChildNodes | TrimRule.Tags);
    get pageComponent(): TrimRule.Page;
    get basePage(): TrimRule.Page;
    compile(): any;
    set exportClose(value: boolean);
}
