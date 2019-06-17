
import * as vscode from 'vscode';
import { isEnabledForJavaScriptDocument, isTypeScriptDocument } from './utils';

function executeCodeActionProvider(uri: vscode.Uri, range: vscode.Range) {
    return vscode.commands.executeCommand<vscode.CodeAction[]>('vscode.executeCodeActionProvider', uri, range);
}

async function getTsLintFixAllCodeAction(document: vscode.TextDocument): Promise<vscode.CodeAction | undefined> {
    const diagnostics = vscode.languages
        .getDiagnostics(document.uri)
        .filter((diagnostic) => diagnostic.source === 'tslint');

    for (const diagnostic of diagnostics) {
        const codeActions = await executeCodeActionProvider(document.uri, diagnostic.range);
        if (codeActions) {
            const fixAll = codeActions.filter((action) => action.title === 'Fix all auto-fixable tslint failures');
            if (fixAll.length > 0) {
                return fixAll[0];
            }
        }
    }
    return undefined;
}

const fixAllCodeActionKind = vscode.CodeActionKind.SourceFixAll.append('tslint');

export class FixAllProvider implements vscode.CodeActionProvider {
    public static metadata: vscode.CodeActionProviderMetadata = {
        providedCodeActionKinds: [fixAllCodeActionKind],
    };

    public async provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken,
    ): Promise<vscode.CodeAction[]> {
        if (!context.only) {
            return [];
        }

        if (!context.only.contains(fixAllCodeActionKind) && !fixAllCodeActionKind.contains(context.only)) {
            return [];
        }

        if (!isTypeScriptDocument(document) && !isEnabledForJavaScriptDocument(document)) {
            return [];
        }

        const fixAllAction = await getTsLintFixAllCodeAction(document);
        if (!fixAllAction) {
            return [];
        }

        return [{
            ...fixAllAction,
            title: 'Fix All TSLint',
            kind: fixAllCodeActionKind,
        }];
    }
}
