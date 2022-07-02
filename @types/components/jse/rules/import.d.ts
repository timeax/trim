import { Compiler } from ".";
export default class Imports extends Compiler {
    names: string[];
    imports: any[];
    compiledId: number;
    constructor(props: any);
    run(params: string[]): void;
    extract(): void;
    buildCode(): string;
}
