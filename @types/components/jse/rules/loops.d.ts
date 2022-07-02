import { Nodemap } from './../../programs/nodemap';
import { Compiler } from ".";
export default class Loops extends Compiler {
    operand: 'in' | 'of';
    component: Nodemap;
    key: any;
    arr: string;
    constructor(props: any);
    run(param: string[]): void;
    close(): void;
    private _object;
    get object(): any[];
    set object(value: any[]);
    compile(): string;
}
