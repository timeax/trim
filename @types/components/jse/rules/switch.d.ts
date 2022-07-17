import { Compiler } from ".";
export default class Switch extends Compiler {
    temp: string;
    value: string;
    constructor(props: any);
    run(params: string[]): void;
    compile(): any;
    split(text: string): any[];
}
