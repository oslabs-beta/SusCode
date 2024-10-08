import * as fs from 'fs';
import * as readline from 'readline';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as sourceMap from 'source-map';
import * as path from 'path';
import * as vscode from 'vscode';

// Interfaces

interface PotentialRequest {
    line: number;
    content: string;
}

interface AnalysisResult {
    file: string;
    line: number;
    column: number;
    url: string;
    originalFile?: string;
    originalLine?: number;
    originalColumn?: number;
}

interface ParserOptions {
    ecmaVersion: number; // acorn.ecmaVersion
    sourceType: 'script' | 'module';
}

// This will analyze the results and then send the results over to a listener in the frontend
// Ok this function gets called multiple times depending on the directory it's looking through
// and the files we identify to search through
// async function analyzeFilesForNetworkRequests(filePath: string): Promise<AnalysisResult[]> {
async function analyzeFilesForNetworkRequests(filePaths: string[], panel: vscode.WebviewPanel, name: string, verbose: boolean | undefined) {
    const finalResults: any = [];
    for (let file of filePaths) {
        // Can I explain the actual use of doing this inital scan? For now all it does is just slims down the
        // number of matches we get, however it's still a complete scan in it of itself. I slim the most down
        // trying to look for a specific "http" text inside a retrieved URL. For now, I'll just keep it there
        const potentialRequests = await initialScan(file);
        const detailedResults = await detailedAnalysis(file, potentialRequests);
        const results: any = await mapResultsToOriginal(file, detailedResults);

        if (results.length) {
            if (verbose) {
                finalResults.push(...results);
            } else {
                const httpPattern = /https?:\/\/[^\s'"]+/;
                finalResults.push(
                    ...results.filter((result: any) => httpPattern.test(result.url))
                );
            }
        }
        // for (let result of finalResults) {
        // let parsedResult = JSON.stringify(result, null, 2);
        // panel.webview.postMessage({ type: 'update', text: parsedResult });
        if (finalResults.length) {
            panel.webview.postMessage({
                type: 'telemetryMatchUpdate',
                resultObjArr: finalResults,
                fileName: file,
                displayName: name,
            });
        }
        // }
    }

    // displayResults(finalResults);
    // So let's say the state object gets loaded fully at this point- I'm going to call
    // this "end" message to simply update the state? Maybe I can also just update the state
    // as each element comes in

    // Potentially use this to update state after everything is done
    // panel.webview.postMessage({
    //     type: 'telemetryMatchEnd',
    // });
}

//////////////////////// testing ////////////////////////

// function displayResults(results: AnalysisResult[]) {
//     const outputChannel = vscode.window.createOutputChannel('Network Request Analysis');
//     outputChannel.clear();
//     outputChannel.show();

//     if (results.length === 0) {
//         outputChannel.appendLine('No potential network requests found.');
//     } else {
//         for (let result of results) {
//             outputChannel.appendLine(`File: ${result.file}`);
//             if (result.originalFile) {
//                 const originalUri = vscode.Uri.file(result.originalFile);
//                 const originalLocation = new vscode.Position(result.originalLine! - 1, result.originalColumn!);
//                 const originalLink = createClickableLink(originalUri, originalLocation, 'Original Source');
//                 outputChannel.appendLine(`Original: ${originalLink}`);
//             }
//             const minifiedUri = vscode.Uri.file(result.file);
//             const minifiedLocation = new vscode.Position(result.line - 1, result.column);
//             const minifiedLink = createClickableLink(minifiedUri, minifiedLocation, 'Minified Source');
//             outputChannel.appendLine(`Minified: ${minifiedLink}`);
//             outputChannel.appendLine(`URL: ${result.url}`);
//             outputChannel.appendLine('');
//         };
//     }

// }

// function createClickableLink(uri: vscode.Uri, position: vscode.Position, text: string): string {
//     return `[${text}](${uri.with({ fragment: `${position.line + 1},${position.character + 1}` })})`;
// }

/////////////////////////////////////////////////////////

async function initialScan(filePath: string): Promise<PotentialRequest[]> {
    const potentialRequests: PotentialRequest[] = [];
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        // The crlfDelay option is there to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        crlfDelay: Infinity
    });

    const networkPatterns = [
        /\b(?:fetch|axios|http|https|get|post|put|delete|ajax)\b/i,
        /\burl\s*:/i,
        /https?:\/\/[^\s'"]+/,
    ];

    let lineNumber = 0;
    for await (const line of rl) {
        lineNumber++;
        if (networkPatterns.some((pattern) => pattern.test(line))) {
            potentialRequests.push({ line: lineNumber, content: line });
        }
    }

    return potentialRequests;
}

function determineParserOptions(content: string): ParserOptions {
    let ecmaVersion = 5;
    let sourceType: 'script' | 'module' = 'script';

    // Check for ES6+ features
    if (/\bconst\b|\blet\b|\b=>\b|\bclass\b/.test(content)) {
        ecmaVersion = 2015;
    }
    // Check for newer features
    if (/\basync\b|\bawait\b/.test(content)) {
        ecmaVersion = 2017;
    }
    if (/\s\.\.\.\w+/.test(content)) {
        // spread operator
        ecmaVersion = 2018;
    }
    // Check if it's likely a module
    if (/\bimport\b|\bexport\b/.test(content)) {
        sourceType = 'module';
    }

    return { ecmaVersion, sourceType };
}

// function isNetworkRequest(node: acorn.Node): boolean {
function isNetworkRequest(node: any): boolean {
    return (
        (node.type === 'CallExpression' &&
            node.callee.type === 'MemberExpression' &&
            ['fetch', 'get', 'post', 'put', 'delete', 'ajax', 'send'].some(
                (name) =>
                    (node.callee.property as any).name === name ||
                    (node.callee.property as any).value === name
            )) ||
        (node.type === 'CallExpression' &&
            node.callee.type === 'Identifier' &&
            ['fetch', 'ajax', 'xhr'].includes(node.callee.name)) ||
        (node.type === 'CallExpression' &&
            node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'Identifier' &&
            node.callee.object.name === '$' &&
            node.callee.property.type === 'Identifier' &&
            ['ajax', 'get', 'post'].includes(node.callee.property.name))
    );
}

// function extractUrl(node: acorn.Node): string | null {
function extractUrl(node: any): string | null {
    if (node.type === 'CallExpression' && node.arguments.length > 0) {
        const arg = node.arguments[0];

        if (arg.type === 'Literal' && typeof arg.value === 'string')
            return arg.value;
        else if (arg.type === 'TemplateLiteral' && arg.quasis.length > 0)
            return arg.quasis[0].value.cooked;
        else if (arg.type === 'ObjectExpression') {
            const urlProp = arg.properties.find(
                (prop: any) =>
                    (prop.key.type === 'Identifier' && prop.key.name === 'url') ||
                    (prop.key.type === 'Literal' && prop.key.value === 'url')
            );
            if (
                urlProp &&
                urlProp.value.type === 'Literal' &&
                typeof urlProp.value.value === 'string'
            ) {
                return urlProp.value.value;
            }
        }
    }
    return null;
}

async function detailedAnalysis(filePath: string, potentialRequests: PotentialRequest[]): Promise<AnalysisResult[]> {
    const content = await fs.promises.readFile(filePath, 'utf8');
    // Depending on the version of JS we're looking at we would have to change our acron parser
    // To determine the version of js we're looking at we just see what unique language features are present
    const { ecmaVersion, sourceType }: any = determineParserOptions(content);

    let ast: acorn.Node;
    try {
        ast = acorn.parse(content, { ecmaVersion, sourceType, locations: true });
    } catch (error) {
        console.warn(`Failed to parse ${filePath} with determined options. Falling back to default options.`);
        ast = acorn.parse(content, { ecmaVersion: 'latest' as any, sourceType: 'module', locations: true });
    }

    const results: AnalysisResult[] = [];

    walk.simple(ast, {
        CallExpression(node: any) {
            if (isNetworkRequest(node)) {
                const url = extractUrl(node);
                if (url) {
                    results.push({
                        file: filePath,
                        line: node.loc.start.line,
                        column: node.loc.start.column,
                        url: url
                    });
                }
            }
        }
    });

    // Filter results based on potential requests from initial scan
    const intersected_results = results.filter(result =>
        potentialRequests.some(req => req.line === result.line)
    );
    return intersected_results;
}

async function mapResultsToOriginal(
    filePath: string,
    results: AnalysisResult[]
): Promise<AnalysisResult[]> {
    const sourceMapPath = `${filePath}.map`;
    let consumer: sourceMap.SourceMapConsumer | null = null;

    try {
        if (fs.existsSync(sourceMapPath)) {
            const sourceMapContent = await fs.promises.readFile(
                sourceMapPath,
                'utf8'
            );
            consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);
        }
    } catch (error) {
        console.warn(`Failed to load source map for ${filePath}: ${error}`);
    }

    // Fix up some of these types later
    const mappedResults: any = results.map((result) => {
        if (consumer) {
            const original = consumer.originalPositionFor({
                line: result.line,
                column: result.column,
            });
            if (original.source) {
                return {
                    ...result,
                    originalFile: path.resolve(path.dirname(filePath), original.source),
                    originalLine: original.line,
                    originalColumn: original.column,
                };
            }
        }
        return result;
    });

    if (consumer) {
        consumer.destroy();
    }

    return mappedResults;
}

export { analyzeFilesForNetworkRequests, AnalysisResult };
