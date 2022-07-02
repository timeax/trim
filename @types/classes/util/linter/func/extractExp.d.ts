import { Linter, Rule } from "eslint";
export default function extractExp(src: string, linter?: Linter): {
    src: string;
    type: Rule.NodeTypes;
}[];
export declare function expressionLinter(source: string, linter?: Linter): Linter.FixReport;
