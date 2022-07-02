import { TrimRule } from "../@types/globals";
import { TrimBaseClass } from "./classes";
export declare class Trim extends TrimBaseClass {
    constructor(props?: any);
    run(path: string, variables?: TrimRule.ProgramOptions, callback?: Function, component?: TrimRule.Program): void;
    nodemap(program: TrimRule.Program, text: string, path: string): void;
    programRun(program: TrimRule.Program, text: string, path?: string): void;
    continue(path: any): void;
    rerun(callback?: Function, path?: string): void;
    finish(): void;
    private start;
    parseCurrent(char: string): boolean;
    parseComment(char: string): void;
    parseJsE(char: string, ignore?: boolean, current?: TrimRule.Element): boolean;
    parseJsS(char: string, current: any): void;
    parseScript(char: string): void;
    parseHTML(char: string): void;
    htmlClose(char: string): boolean;
    parseText(char: string): boolean;
}
