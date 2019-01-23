import { CodeAction, Command, commands, languages, Range, TextDocument, TextEdit, Uri, window, workspace } from 'vscode';

export function isTypeScriptDocument(document: TextDocument) {
    return document.languageId === 'typescript' || document.languageId === 'typescriptreact';
}

export function isJavaScriptDocument(languageId: string) {
    return languageId === 'javascript' || languageId === 'javascriptreact';
}

export function isEnabledForJavaScriptDocument(document: TextDocument) {
    let isJsEnable = workspace.getConfiguration('tslint', document.uri).get('jsEnable', true);
    if (isJsEnable && isJavaScriptDocument(document.languageId)) {
        return true;
    }
    return false;
}

function executeCodeActionProvider(uri: Uri, range: Range) {
    return commands.executeCommand<(CodeAction | Command)[]>('vscode.executeCodeActionProvider', uri, range);
}

export async function fixAll(document: TextDocument) {
    const diagnostics = languages
        .getDiagnostics(document.uri)
        .filter(diagnostic => diagnostic.source === 'tslint');

    for (let diagnostic of diagnostics) {
        const codeActions = await executeCodeActionProvider(
            document.uri,
            diagnostic.range
        );
        if (codeActions) {
            const fixAll = codeActions.filter(
                ({ title }) => title === 'Fix all auto-fixable tslint failures'
            );
            if (fixAll.length) {
                const codeActionOrCommand = fixAll[0];
                if (codeActionOrCommand instanceof CodeAction) {
                    if (codeActionOrCommand.edit) {
                        await workspace.applyEdit(codeActionOrCommand.edit);
                    }
                }
                const command = codeActionOrCommand instanceof CodeAction ? codeActionOrCommand.command : codeActionOrCommand;
                if (command) {
                    const args = ('arguments' in command) ? command.arguments || [] : [];
                    await commands.executeCommand(command.command, ...args);
                }
                break;
            }
        }
    }
}
