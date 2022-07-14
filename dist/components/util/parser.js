"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    static isWord(char) {
        return /\w/.test(char);
    }
    static isWs(char) {
        return char.match(/\s/g) !== null;
    }
    static isNl(char) {
        return char.indexOf('\n') === 0;
    }
    static isWN(char) {
        return this.isWs(char) || this.isNl(char);
    }
    static parse(word) {
        var result = "TextNode";
        if (word === '{{')
            result = 'JsE';
        else if (word === '{%')
            result = 'JsE';
        else if (word === '{@')
            result = 'JsRule';
        else if (word === '/*' || word === '//')
            result = 'Comment';
        else if (word.trim().startsWith('<%'))
            result = 'Script';
        else if (word.trim().match(/<\w+/g))
            result = 'HTML';
        else if (word.trim().match(/<>/g))
            result = 'Fragment';
        return result;
    }
    static isCaped(word) {
        return /[A-Z]/.test(word);
    }
    static isQuote(char) {
        return char === `'` || char === `"`;
    }
    static isBrace(char) {
        return char === '{' || char === '}';
    }
    static isAccepted(char) {
        return (this.isWord(char) || char == '-' || char == '$' || char == '_');
    }
}
exports.default = Parser;
