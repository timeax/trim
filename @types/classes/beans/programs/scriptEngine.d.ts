import { TrimRule } from "../../../../@types/globals";
import { Element } from "../element";
export declare class ScriptEngine extends Element implements TrimRule.ScriptEngine {
    name: "ScriptEngine";
    value: string;
    type: 'Script';
    names: string[];
    compileId: number;
    private _script;
    get script(): string;
    set script(value: string);
    private _env;
    get env(): TrimRule.env[];
    set env(value: TrimRule.Value | TrimRule.Value[]);
    set __env(env: TrimRule.env | TrimRule.env[]);
    constructor(props: any);
    set reset(value: boolean);
    lint(): void;
    compile(): string;
    get exportText(): string;
    getType(type: string): "const" | "var" | "let";
}
