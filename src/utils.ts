import { TextDocument, workspace } from 'vscode';

export function isTypeScriptDocument(document: TextDocument) {
    return document.languageId === 'typescript' || document.languageId === 'typescriptreact';
}

export function isJavaScriptDocument(document: TextDocument) {
    return document.languageId === 'javascript' || document.languageId === 'javascriptreact';
}

export function isEnabledForJavaScriptDocument(document: TextDocument) {
    const isJsEnable = workspace.getConfiguration('tslint', document.uri).get('jsEnable', true);
    if (isJsEnable && isJavaScriptDocument(document)) {
        return true;
    }
    return false;
}

export function shouldBeLinted(document: TextDocument) {
    return isTypeScriptDocument(document)
        || (isJavaScriptDocument(document) && isEnabledForJavaScriptDocument(document));
}
