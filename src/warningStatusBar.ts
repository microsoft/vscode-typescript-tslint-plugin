import * as vscode from 'vscode';
import { shouldBeLinted } from './utils';

export class TsLintConfigurationStatusBarWarning {

    private _disposables: vscode.Disposable[] = [];
    private readonly _statusBarItem: vscode.StatusBarItem;

    private _activeDocument: vscode.Uri | undefined = undefined;

    private readonly command = '_tslintPlugin.showHelp';

    public constructor() {
        this._disposables.push(vscode.commands.registerCommand(this.command, async () => {
            const help = { title: 'Help', isCloseAffordance: true };
            const close = { title: 'Close', isCloseAffordance: true };
            const result = await vscode.window.showErrorMessage(this._statusBarItem.tooltip || 'TSLint Error',
                help, close);

            switch (result) {
                case help:
                    return vscode.env.openExternal(
                        vscode.Uri.parse('https://github.com/microsoft/typescript-tslint-plugin#readme'));
            }
        }));

        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 0);
        this._statusBarItem.command = this.command;

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
        const tsLintConfigError = diagnostics.find((diagnostic) =>
            diagnostic.source === 'tslint' && diagnostic.message.startsWith('Failed to load the TSLint library'));

        if (tsLintConfigError) {
            this._statusBarItem.text = '$(alert) TSLint';
            this._statusBarItem.tooltip = tsLintConfigError.message;
            this._statusBarItem.show();
        } else {
            this._statusBarItem.text = 'TSLint';
            this._statusBarItem.hide();
        }
    }
}
