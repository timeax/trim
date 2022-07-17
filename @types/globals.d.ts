import { Default } from '@timeax/utilities';
export declare namespace TrimRule {
    export interface BaseNode extends Default {
        type: NodeTypes;
        loc?: SourceLocation | null | undefined;
        range?: [number, number] | undefined;
        sourceParent: Program;
        globalParent: Program;
        isBlock: boolean;
        closed: boolean;
        isClosed: boolean;
        close: () => void;
        stop?: boolean;
        parent?: Parent;
        set sourceChange(value: Program): void
        compiledText: string;
        compile: () => any
    }

    export type NodeTypes = Node['type']
    export interface Element extends BaseNode {
        temp: string;
        isUseless: boolean;
        firstRun: boolean;
        parent: Parent;
        preserveText?: boolean;
        compileAsText: boolean;
        [x: string]: any
    };
    export interface SourceLocation {
        source?: string | null | undefined;
        path: string;
        start: Position;
        end: Position;
    }
    export interface Position {
        /** >= 1 */
        line: number;
        /** >= 0 */
        column: number;
    }
    export interface Compiler {
        compile: () => string;
        run: (...props) => void
    }
    export type Node = Comment | Program | TextNode | JsE | Script | HTML | JsRule | Attributes | Fragment;
    export type Tags = Comment | TextNode | JsE | Script | HTML | JsRule | Fragment;
    export interface Comment extends Element {
        type: 'Comment';
        value: string;
        commentType: 'inline' | 'block';
        closeComment: boolean;
    }
    export type Program = Export | Page | Nodemap | Scraps | Include | Asset;
    export interface TextNode extends Element {
        type: 'TextNode';
        value: string;
    }
    export interface Script extends Element {
        type: 'Script';
        value: string;
        compileId: number;
    }

    export type ChildNodes = Array<Tags>;

    export interface Parent extends Element {
        get children(): ChildNodes;
        set children(prop: ChildNodes | Element | Node): void;
        get name(): string;
        childTest(value: Tags): {msg: string, valid: boolean};
    }

    export interface Fragment extends HTML {
        name: 'FragmentTag$';
        isBlock: true;
        htmlType: 'DomElement';
        type: 'Fragment'
    }

    export interface ScriptEngine extends Script {
        compile();
        reset: boolean;
        name: 'ScriptEngine';
        set env(env: Value | Value[]);
        get env(): env[];
        set __env(value: env | env[]): void;
        set resetAndCompile(value: boolean): void
    }
    export interface env {
        name: string;
        type: 'const' | 'var' | 'let';
        id: any;
        value?: any;
    }
    export interface JsE extends Element {
        type: 'JsE';
        sourceType: 'script' | 'expression';
        value: string;
        compileId: number;
        raw: any;
        preserveText: boolean;
        script: string;
    }
    export interface HTML extends Parent {
        get type(): 'HTML';
        name: string;
        htmlType: 'Custom' | 'DOMElement' | 'Component';
        parseAttr(char: string): void;
        attr: Attributes;
        attributes: Array<Attributes>;
        preserveText: boolean;
        config: DomConfig;
    }

    export interface DomConfig {
        name: string;
        path: string;
        isBlock: boolean;
    }

    export interface Attributes extends BaseNode {
        char: string;
        quotes: { type: string; count: number; uses: boolean; }
        valueType: 'string' | 'JsE';
        value: AttrValue;
        compiledName: string;
        compiledValue: string;
        type: 'Attributes';
        temp: string;
        name: Nodemap;
        raw: any;
    }

    export type AttrValue = string & { type: 'string' } | JsE;

    export interface JsRule extends Parent {
        type: 'JsRule';
        config: JsRuleConfig;
        params: string[];
        name: string;
        props: string;
        component?: Program;
    }
    export interface JsRuleConfig {
        name: string;
        loader?: boolean;
        path: string;
        isSetter?: boolean;
        isBlock: boolean;
    }

    export type Imports = ExportType | Include | Scraps;

    export interface Programs extends BaseNode {
        set body(value: ChildNodes | Tags): void;
        get body(): Array<Node | Element | Parent>
        type: 'Program';
        readonly sourceType: string;
        scriptEngine: ScriptEngine;
        get imports(): Array<Imports>;
        set imports(props: Array<Imports> | Imports): void
        get assets(): string[];
        set assets(props: string | string[]): void
        props: Props;
        isStrict: boolean;
        set globals(env);
        get globals(): Globals
        set rerun(env: boolean);
        get rerun(): boolean
        __globals: object;
        path: string;
        recompile?: boolean;
        trim: Trim;
        set reset(value: boolean);
        get pageComponent(): Page;
        get basePage(): Page;
        run(path: string, type: string = ''): void;
    }

    export type Trim = import('./../src/index').Trim;

    export interface ProgramOptions {
        globals?: Globals;
        sourceParent?: Program;
        props?: Props;
    }

    export type Props = object & { type?: '' } | Attributes | Attributes[];

    export interface Globals {
        props: object;
        [x: string]: any
    }

    export interface Export extends Programs {
        sourceType: 'Export';
        isStrict: true;
        exports: Array<ExportType>;
    }

    export type ExportType = Component | WebComponent;

    export interface Components extends Programs {
        sourceType: 'Export';
        exportType: string;
        isStrict: boolean;
        name: string;
        ref: string;
        fragment: Program;
        isDefault: boolean;
        set exportClose(value: boolean);
    }

    export interface Component extends Components {
        exportType: 'normal';
        isStrict: false;
    }

    export interface WebComponent extends Components {
        exportType: 'web';
        isStrict: true;
    }
    export interface Page extends Programs {
        sourceType: 'Page';
        emit: () => void;
        isStrict: true;
    }
    export interface Nodemap extends Programs {
        sourceType: 'NodeMap';
        nodeType: 'NameMap' | 'ElementMap';
        body: Array<Element>;
        run: (text: string, type: this['nodeType'], path: string = '') => void;
        isStrict: false;
    }
    export interface NodemapOtions {
        line
    }
    export interface Include extends Programs {
        sourceType: 'Include';
        isStrict: boolean = false;
        ext: '.htm' | '.txt' | '.trim' | '.js';
        exts: ['.htm', '.txt', '.js', '.trim'];
        program: Nodemap | Programs;
        fileContent: string = '';
    };

    export interface Scraps extends Programs {
        sourceType: 'Scraps';
        restLoc: string;
        isStrict: true;
        nodes: Nodemap;
    }

    export interface ScrapsOptions {
        start: string;
        end: string;
        sourceParent: Program;
        children: Nodemap;
    }

    export interface Asset extends Programs {
        sourceType: 'Assets';
        contentType: 'js' | 'css' | 'sass' | 'json' | 'txt';
    }
    export interface TrimConfig {
        compilerOptions: {
            rules: {
                default: {},
                userDefined: Array<{ name: string, path: string }>
            },
            allowHTM: boolean,
            outDir: string,
            outFile: string,
            compileExtension: string,
            extensionPrefix: string,
            allowNullValues: boolean;
            langOptions: {
                begin: string,
                name: string,
                end: string
            }
        },
        useAlpine: boolean;
        exclude: string[],
        include: string[]
    }

    export declare var Exports: Array<{
        path: string,
        component: import('./globals').TrimRule.Export,
    }>;


    export interface Value {
        type: 'const' | 'var' | 'let' | 'function' | 'class', names: string[]
    }

    export interface JSXOptions {
        path: string;
        wrapper: 'text' | 'func';
        imports?: Array<{ name: string, path: string, local: string, default: boolean }>;
    }

    export { };
}

