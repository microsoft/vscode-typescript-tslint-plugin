import * as vscode from 'vscode';
import { shouldBeLinted } from './utils';
import { WorkspaceLibraryExecutionManager } from './workspaceTrustManager';

export class TsLintConfigurationStatusBarWarning {

    private readonly showHelpCommand = '_tslintPlugin.showHelp';

    private readonly workspaceTrustManager: WorkspaceLibraryExecutionManager;

    private _disposables: vscode.Disposable[] = [];
    private readonly _statusBarItem: vscode.StatusBarItem;

    private _activeDocument: vscode.Uri | undefined = undefined;

    public constructor(workspaceTrustManager: WorkspaceLibraryExecutionManager) {
        this.workspaceTrustManager = workspaceTrustManager;

        this._disposables.push(vscode.commands.registerCommand(this.showHelpCommand, async () => {
            const manageTrust: vscode.MessageItem = {
                title: 'Manage Library Execution',
                isCloseAffordance: true,
            };

            const help: vscode.MessageItem = { title: 'Help', isCloseAffordance: true };
            const close: vscode.MessageItem = { title: 'Close', isCloseAffordance: true };

            const result = await vscode.window.showErrorMessage(this._statusBarItem.tooltip || 'TSLint Error',
                manageTrust,
                help,
                close);

            switch (result) {
                case help:
                    return vscode.env.openExternal(
                        vscode.Uri.parse('https://github.com/microsoft/typescript-tslint-plugin#readme'));

                case manageTrust:
                    return this.workspaceTrustManager.showTrustUi();
            }
        }));

        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
        this._statusBarItem.command = this.showHelpCommand;

        vscode.languages.onDidChangeDiagnostics((e) => {
            if (!this._activeDocument || !vscode.window.activeTextEditor) {
                return;
            }
            for (const uri of e.uris) {
                if (uri.fsPath === this._activeDocument.fsPath) {
                    this._updateForActiveEditor(vscode.window.activeTextEditor);
                    break;
                }
            }
        }, undefined, this._disposables);

        vscode.window.onDidChangeActiveTextEditor(this._updateForActiveEditor, this, this._disposables);
        this._updateForActiveEditor(vscode.window.activeTextEditor);
    }

    public dispose() {
        for (const disposable of this._disposables) {
            disposable.dispose();
        }
        this._disposables = [];
        this._statusBarItem.dispose();
    }

    private _updateForActiveEditor(activeTextEditor: vscode.TextEditor | undefined) {
        this._activeDocument = activeTextEditor ? activeTextEditor.document.uri : undefined;
        if (!activeTextEditor) {
            this._statusBarItem.hide();
            return;
        }

        if (!shouldBeLinted(activeTextEditor.document)) {
            this._statusBarItem.hide();
            return;
        }

        const diagnostics = vscode.languages.getDiagnostics(activeTextEditor.document.uri);
        const failedToLoadError = diagnostics.find((diagnostic) =>
            diagnostic.source === 'tslint' && diagnostic.message.startsWith('Failed to load the TSLint library'));

        const notUsingWorkspaceVersionError = diagnostics.find((diagnostic) =>
            diagnostic.source === 'tslint'
            && diagnostic.message.startsWith('Not using the local TSLint version found'));

        if (failedToLoadError || notUsingWorkspaceVersionError) {
            this._statusBarItem.text = '$(circle-slash) TSLint';
            this._statusBarItem.color = new vscode.ThemeColor('errorForeground');
            this._statusBarItem.tooltip = failedToLoadError?.message ?? notUsingWorkspaceVersionError?.message;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.text = 'TSLint';
            this._statusBarItem.hide();
        }
    }
}
