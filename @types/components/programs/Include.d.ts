import { TrimRule } from "../../../@types/globals";
import { Program } from "../../classes/beans/programs";
export declare class Include extends Program implements TrimRule.Include {
    program: TrimRule.Programs | TrimRule.Nodemap;
    exts: [".htm", ".txt", ".js"];
    ext: ".js" | ".htm" | ".txt";
    sourceType: 'Include';
    fileContent: string;
    parentNode: TrimRule.Parent;
    constructor(props: any, options: TrimRule.ProgramOptions);
    get path(): string;
    set path(value: string);
    run(): void;
    get rerun(): boolean;
    set rerun(value: boolean);
    compile(): any;
    close(): void;
}
