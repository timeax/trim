import { TrimRule } from '../../../../../@types/globals';
export default function parseJsE(src: string, env: TrimRule.env[], linter: import('eslint').Linter): {
    verify(): string;
};
