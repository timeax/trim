import { JsEBase } from "../../classes/beans/jse";
export declare class JsE extends JsEBase {
    constructor(props: any);
    compile(): string;
    compileResult(result: any): string | any;
    filter(text: string): string;
}
