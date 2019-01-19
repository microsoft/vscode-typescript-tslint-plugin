import * as vscode from 'vscode';
import { isTypeScriptDocument, isEnabledForJavaScriptDocument, fixAll } from './utils';

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

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration(configurationSection)) {
                synchronizeConfiguration(api);
            }
        }, undefined, context.subscriptions),
        vscode.workspace.onWillSaveTextDocument(willSaveTextDocument)
    );

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
    if (typeof configSetting.globalValue === 'undefined' && typeof configSetting.workspaceFolderValue === 'undefined' && typeof configSetting.workspaceValue === 'undefined') {
        return;
    }

    const value = config.get<vscode.WorkspaceConfiguration[K] | undefined>(key, undefined);
    if (typeof value !== 'undefined') {
        outConfig[key] = value;
    }
}

async function willSaveTextDocument(e: vscode.TextDocumentWillSaveEvent) {
    const config = vscode.workspace.getConfiguration('tslint', e.document.uri);
    const autoFix = config.get('autoFixOnSave', false);
    if (autoFix) {
        const document = e.document;

        // only auto fix when the document was manually saved by the user
        if (!(isTypeScriptDocument(document) || isEnabledForJavaScriptDocument(document))
            || e.reason !== vscode.TextDocumentSaveReason.Manual) {
            return;
        }

        const promise = fixAll(document);
        e.waitUntil(promise);
        await promise;
    }
}
