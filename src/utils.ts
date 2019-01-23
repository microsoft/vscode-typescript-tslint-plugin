import { TextDocument, workspace } from 'vscode';

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
