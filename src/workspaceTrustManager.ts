import * as vscode from 'vscode';

export const manageWorkspaceTrustCommand = 'tslint.manageWorkspaceLibraryExecution';
export const resetWorkspaceTrustCommand = 'tslint.resetWorkspaceLibraryExecution';

export class WorkspaceLibraryExecutionManager {

    private readonly isTrustedWorkspaceKey = 'tslint.isTrustedWorkspace';
    private readonly isTrustedGloballyKey = 'tslint.allowGlobalLibraryExecution';

    private _disposables: vscode.Disposable[] = [];

    private readonly _onDidChange = new vscode.EventEmitter<void>();
    public readonly onDidChange = this._onDidChange.event;

    private readonly globalMemento: vscode.Memento;
    private readonly workspaceMemento: vscode.Memento;

    constructor(context: {
        globalState: vscode.Memento
        workspaceState: vscode.Memento
    }) {
        this.globalMemento = context.globalState;
        this.workspaceMemento = context.workspaceState;

        this._disposables.push(vscode.commands.registerCommand(manageWorkspaceTrustCommand, () => {
            this.showTrustUi();
        }));

        this._disposables.push(vscode.commands.registerCommand(resetWorkspaceTrustCommand, () => {
            this.reset();
        }));
    }

    public dispose() {
        for (const disposable of this._disposables) {
            disposable.dispose();
        }
        this._disposables = [];
    }

    public allowWorkspaceLibraryExecution(): boolean | undefined {
        const global = this.globalMemento.get<boolean>(this.isTrustedGloballyKey);
        if (global) {
            return true;
        }
        return this.workspaceMemento.get<boolean>(this.isTrustedWorkspaceKey);
    }

    public async showTrustUi(): Promise<void> {
        const currentIsTrustedWorkspaceValue = this.workspaceMemento.get<boolean>(this.isTrustedWorkspaceKey);

        const trustItem: vscode.QuickPickItem = {
            label: "Enable workspace library execution",
            description: currentIsTrustedWorkspaceValue === true ? "(currently active)" : undefined,
            detail: "Enable loading TSLint and linting rules from the current workspace.",
        };

        const untrustItem: vscode.QuickPickItem = {
            label: "Disable workspace library execution",
            description: currentIsTrustedWorkspaceValue === false ? "(currently active)" : undefined,
            detail: "Blocks loading TSLint from the current workspace. The global TSLint can still be used.",
        };

        const trustGloballyItem: vscode.QuickPickItem = {
            label: "Always enable workspace library execution",
            description: this.globalMemento.get(this.isTrustedGloballyKey) ? "(enabled)" : undefined,
            detail: "Enables loading TSLint in all workspaces without prompting.",
        };

        const helpItem: vscode.QuickPickItem = {
            label: "Help",
        };

        const result = await vscode.window.showQuickPick([
            trustItem,
            untrustItem,
            trustGloballyItem,
            helpItem
        ], {
            placeHolder: "Configure workspace library execution"
        });

        switch (result) {
            case trustItem:
                await this.workspaceMemento.update(this.isTrustedWorkspaceKey, true);
                this._onDidChange.fire();
                break;

            case untrustItem:
                await this.workspaceMemento.update(this.isTrustedWorkspaceKey, false);
                this._onDidChange.fire();
                break;

            case trustGloballyItem:
                await this.globalMemento.update(this.isTrustedGloballyKey, true);
                this._onDidChange.fire();
                break;

            case helpItem:
                await vscode.env.openExternal(
                    vscode.Uri.parse('https://github.com/microsoft/typescript-tslint-plugin#readme'));
                break;
        }
    }

    private reset() {
        this.globalMemento.update(this.isTrustedGloballyKey, undefined);
        this.workspaceMemento.update(this.isTrustedWorkspaceKey, undefined);
        this._onDidChange.fire();
    }
}
