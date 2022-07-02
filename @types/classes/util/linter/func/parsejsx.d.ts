import { Linter } from "eslint";
export default function parseJsx(src: string, linter?: Linter): {
    verify(): string;
};
