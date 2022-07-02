import { Linter } from "eslint";
import { TrimRule } from "../../../../../@types/globals";
export default function extract(src: string, linter?: Linter, options?: {
    env: any[];
    useImports: boolean;
    id: number;
}): {
    env: TrimRule.Value[];
    names: string[];
    out: string;
};
export declare function resolveImports(src: string, linter: Linter, use: boolean): string;
export declare function extractAllVars(src: string, linter: Linter, existing: TrimRule.env[], id: any): {
    verify(): {
        env: TrimRule.Value[];
        names: string[];
    };
};
export interface Value {
    type: 'const' | 'var' | 'let' | 'function' | 'class';
    names: string[];
}
