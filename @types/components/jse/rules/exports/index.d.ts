import { Compiler } from "..";
export default class ExportRule extends Compiler {
    private _name;
    get name(): string;
    set name(value: string);
    type: 'web' | 'normal';
    default: boolean;
    constructor(props: any);
    run(params?: string[]): void;
    close(): void;
}
