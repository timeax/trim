import { TrimRule } from "../../../@types/globals";
export default class Parser {
    static isWord(char: string): boolean;
    static isWs(char: string): boolean;
    static isNl(char: string): boolean;
    static isWN(char: string): boolean;
    static parse(word: string): TrimRule.NodeTypes;
    static isCaped(word: string): boolean;
    static isQuote(char: string): boolean;
    static isBrace(char: string): boolean;
    static isAccepted(char: string): boolean;
}
