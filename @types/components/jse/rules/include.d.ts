import { Compiler } from ".";
export default class Includer extends Compiler {
    strict: boolean;
    constructor(props: any);
    run(params: string[]): void;
    include(): void;
}
