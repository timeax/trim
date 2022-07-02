import { Default } from '@timeax/utilities';
import { Linter, Rule } from 'eslint';
import { TrimRule } from '../../../../@types/globals';
export default class CodeLinter extends Default {
    private _linter;
    get linter(): Linter;
    set linter(value: Linter);
    constructor();
    static parseImportStatement(src: string, obj?: CodeLinter): import("./func/parseImport").importLint[];
    static jsxLinter(src: string, obj?: CodeLinter): {
        verify(): string;
    };
    static parseJsE(src: string, env: TrimRule.env[], obj?: CodeLinter): {
        verify(): string;
    };
    static report: (context: Rule.RuleContext, fix: (fixer: Rule.RuleFixer) => any, node: any, msg?: string) => void;
    static reportErr: (context: Rule.RuleContext, node: any, msg?: string) => void;
    static extractExpression(src: string, obj?: CodeLinter): {
        src: string;
        type: "ArrayExpression" | "ArrayPattern" | "ArrowFunctionExpression" | "AssignmentExpression" | "AssignmentPattern" | "AwaitExpression" | "BinaryExpression" | "BlockStatement" | "BreakStatement" | "CallExpression" | "CatchClause" | "ChainExpression" | "ClassBody" | "ClassDeclaration" | "ClassExpression" | "ConditionalExpression" | "ContinueStatement" | "DebuggerStatement" | "DoWhileStatement" | "EmptyStatement" | "ExportAllDeclaration" | "ExportDefaultDeclaration" | "ExportNamedDeclaration" | "ExportSpecifier" | "ExpressionStatement" | "ForInStatement" | "ForOfStatement" | "ForStatement" | "FunctionDeclaration" | "FunctionExpression" | "Identifier" | "IfStatement" | "ImportDeclaration" | "ImportDefaultSpecifier" | "ImportExpression" | "ImportNamespaceSpecifier" | "ImportSpecifier" | "LabeledStatement" | "Literal" | "LogicalExpression" | "MemberExpression" | "MetaProperty" | "MethodDefinition" | "NewExpression" | "ObjectExpression" | "ObjectPattern" | "Program" | "Property" | "RestElement" | "ReturnStatement" | "SequenceExpression" | "SpreadElement" | "Super" | "SwitchCase" | "SwitchStatement" | "TaggedTemplateExpression" | "TemplateElement" | "TemplateLiteral" | "ThisExpression" | "ThrowStatement" | "TryStatement" | "UnaryExpression" | "UpdateExpression" | "VariableDeclaration" | "VariableDeclarator" | "WhileStatement" | "WithStatement" | "YieldExpression" | "StaticBlock" | "PrivateIdentifier" | "PropertyDefinition";
    }[];
    static parseExpression(src: string, obj?: CodeLinter): Linter.FixReport;
    static parseScript(src: string, options: {
        env: TrimRule.env[];
        useImports: boolean;
        id: number;
    }, obj?: CodeLinter): {
        env: TrimRule.Value[];
        names: string[];
        out: string;
    };
    static lintText(src: string): boolean;
}
