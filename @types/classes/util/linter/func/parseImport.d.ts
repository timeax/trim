import { Linter } from "eslint";
export default function parseImport(src: string, linter?: Linter): importLint[];
export interface importLint {
    src: string;
    imports: importObj;
}
declare type importObj = Array<{
    imported: string;
    local: string;
    default: boolean;
}>;
export {};
