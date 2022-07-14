import { Linter } from "eslint";
import { TrimRule } from "../../../../../@types/globals";
export default function parseJsx(src: string, linter: Linter, options: TrimRule.JSXOptions): {
    verify(): string;
};
