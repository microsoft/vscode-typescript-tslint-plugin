import * as vscode from 'vscode';
import { FixAllProvider } from './fixAll';

const typeScriptExtensionId = 'vscode.typescript-language-features';
const pluginId = 'typescript-tslint-plugin';
const configurationSection = 'tslint';

interface SynchronizedConfiguration {
    alwaysShowRuleFailuresAsWarnings?: boolean;
    ignoreDefinitionFiles?: boolean;
    configFile?: string;
    suppressWhileTypeErrorsPresent?: boolean;
    jsEnable?: boolean;
    exclude?: string | string[];
    packageManager?: 'npm' | 'pnpm' | 'yarn';
}

export async function activate(context: vscode.ExtensionContext) {
    const extension = vscode.extensions.getExtension(typeScriptExtensionId);
    if (!extension) {
        return;
    }

    await extension.activate();
    if (!extension.exports || !extension.exports.getAPI) {
        return;
    }
    const api = extension.exports.getAPI(0);
    if (!api) {
        return;
    }

    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(configurationSection)) {
            synchronizeConfiguration(api);
        }
    }, undefined, context.subscriptions);

    const selector: vscode.DocumentFilter[] = [];
    for (const language of ['javascript', 'javascriptreact', 'typescript', 'typescriptreact']) {
        selector.push({ language, scheme: 'file' });
        selector.push({ language, scheme: 'untitled' });
    }

    context.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(selector, new FixAllProvider(), FixAllProvider.metadata));

    synchronizeConfiguration(api);
}

function synchronizeConfiguration(api: any) {
    api.configurePlugin(pluginId, getConfiguration());
}

function getConfiguration(): SynchronizedConfiguration {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const outConfig: SynchronizedConfiguration = {};

    withConfigValue(config, outConfig, 'alwaysShowRuleFailuresAsWarnings');
    withConfigValue(config, outConfig, 'ignoreDefinitionFiles');
    withConfigValue(config, outConfig, 'suppressWhileTypeErrorsPresent');
    withConfigValue(config, outConfig, 'jsEnable');
    withConfigValue(config, outConfig, 'configFile');
    withConfigValue(config, outConfig, 'exclude');
    withConfigValue(config, outConfig, 'packageManager');

    return outConfig;
}

function withConfigValue<C, K extends Extract<keyof C, string>>(
    config: vscode.WorkspaceConfiguration,
    outConfig: C,
    key: K,
): void {
    const configSetting = config.inspect<C[K]>(key);
    if (!configSetting) {
        return;
    }

    // Make sure the user has actually set the value.
    // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
    if (typeof configSetting.globalValue === 'undefined'
        && typeof configSetting.workspaceFolderValue === 'undefined'
        && typeof configSetting.workspaceValue === 'undefined'
    ) {
        return;
    }

    const value = config.get<vscode.WorkspaceConfiguration[K] | undefined>(key, undefined);
    if (typeof value !== 'undefined') {
        (outConfig as any)[key] = value;
    }
}
