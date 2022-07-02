import { Compiler } from "..";
export default class ExportRule extends Compiler {
    name: string;
    type: 'web' | 'normal';
    constructor(props: any);
    run(params: string[]): void;
    close(): void;
}
