import * as vscode from 'vscode';

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

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration(configurationSection)) {
            synchronizeConfiguration(api);
        }
    }, undefined, context.subscriptions);

    synchronizeConfiguration(api);
}

function synchronizeConfiguration(api: any) {
    api.configurePlugin(pluginId, getConfiguration());
}

function getConfiguration(): SynchronizedConfiguration {
    const config = vscode.workspace.getConfiguration(configurationSection);
    const outConfig: SynchronizedConfiguration = {};

    withConfigValue<boolean>(config, 'alwaysShowRuleFailuresAsWarnings', value => { outConfig.alwaysShowRuleFailuresAsWarnings = value; });
    withConfigValue<boolean>(config, 'ignoreDefinitionFiles', value => { outConfig.ignoreDefinitionFiles = value; });
    withConfigValue<boolean>(config, 'suppressWhileTypeErrorsPresent', value => { outConfig.suppressWhileTypeErrorsPresent = value; });
    withConfigValue<boolean>(config, 'jsEnable', value => { outConfig.jsEnable = value; });
    withConfigValue<string>(config, 'configFile', value => { outConfig.configFile = value; });
    withConfigValue<string | string[]>(config, 'exclude', value => { outConfig.exclude = value; });

    return outConfig;
}

function withConfigValue<T>(config: vscode.WorkspaceConfiguration, key: string, withValue: (value: T) => void): void {
    const configSetting = config.inspect(key);
    if (!configSetting) {
        return;
    }

    // Make sure the user has actually set the value.
    // VS Code will return the default values instead of `undefined`, even if user has not don't set anything.
    if (typeof configSetting.globalValue === 'undefined' && typeof configSetting.workspaceFolderValue === 'undefined' && typeof configSetting.workspaceValue === 'undefined') {
        return;
    }

    const value = config.get<T | undefined>(key, undefined);
    if (typeof value !== 'undefined') {
        withValue(value);
    }
}