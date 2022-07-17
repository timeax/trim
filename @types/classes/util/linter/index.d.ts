import { Default } from '@timeax/utilities';
import { Linter, Rule } from 'eslint';
import { TrimRule } from '../../../../@types/globals';
export default class CodeLinter extends Default {
    private _linter;
    get linter(): Linter;
    set linter(value: Linter);
    constructor();
    static parseImportStatement(src: string, obj?: CodeLinter): import("./func/parseImport").importLint[];
    static jsxLinter(src: string, options: TrimRule.JSXOptions, obj?: CodeLinter): {
        verify(): string;
    };
    static parseJsE(src: string, env: TrimRule.env[], obj?: CodeLinter): {
        verify(): string;
    };
    static report: (context: Rule.RuleContext, fix: (fixer: Rule.RuleFixer) => any, node: any, msg?: string) => void;
    static reportErr: (context: Rule.RuleContext, node: any, msg?: string) => void;
    static extractExpression(src: string, obj?: CodeLinter): {
        src: string;
        type: "Program" | "CatchClause" | "ClassBody" | "Identifier" | "Literal" | "MethodDefinition" | "PrivateIdentifier" | "Property" | "PropertyDefinition" | "SpreadElement" | "Super" | "SwitchCase" | "TemplateElement" | "VariableDeclarator" | "ArrayExpression" | "ArrowFunctionExpression" | "AssignmentExpression" | "AwaitExpression" | "BinaryExpression" | "CallExpression" | "ChainExpression" | "ClassExpression" | "ConditionalExpression" | "FunctionExpression" | "ImportExpression" | "LogicalExpression" | "MemberExpression" | "MetaProperty" | "NewExpression" | "ObjectExpression" | "SequenceExpression" | "TaggedTemplateExpression" | "TemplateLiteral" | "ThisExpression" | "UnaryExpression" | "UpdateExpression" | "YieldExpression" | "ClassDeclaration" | "FunctionDeclaration" | "ImportDeclaration" | "ExportNamedDeclaration" | "ExportDefaultDeclaration" | "ExportAllDeclaration" | "ImportSpecifier" | "ImportDefaultSpecifier" | "ImportNamespaceSpecifier" | "ExportSpecifier" | "ObjectPattern" | "ArrayPattern" | "RestElement" | "AssignmentPattern" | "ExpressionStatement" | "BlockStatement" | "StaticBlock" | "EmptyStatement" | "DebuggerStatement" | "WithStatement" | "ReturnStatement" | "LabeledStatement" | "BreakStatement" | "ContinueStatement" | "IfStatement" | "SwitchStatement" | "ThrowStatement" | "TryStatement" | "WhileStatement" | "DoWhileStatement" | "ForStatement" | "ForInStatement" | "ForOfStatement" | "VariableDeclaration";
    }[];
    static parseExpression(src: string, args?: string[], obj?: CodeLinter): Linter.FixReport;
    static parseScript(src: string, options: TrimRule.JSXOptions & {
        env: TrimRule.env[];
        useImports: boolean;
        id: number;
    }, obj?: CodeLinter): {
        env: TrimRule.Value[];
        names: string[];
        out: string;
    };
    static lintText(src: string): {
        valid: boolean;
        msg: {
            message: string;
        };
    };
}
export declare class CustomError extends Error {
    constructor(props: any, name?: string);
}
