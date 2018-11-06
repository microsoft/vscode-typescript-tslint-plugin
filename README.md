[![](https://vsmarketplacebadge.apphb.com/version/ms-vscode.vscode-typescript-tslint-plugin.svg)](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)

Adds [tslint](https://github.com/palantir/tslint) to VS Code using the [TypeScript TSLint language service plugin](https://github.com/Microsoft/typescript-tslint-plugin).

Please refer to the [tslint documentation](https://github.com/palantir/tslint) for how to configure the linting rules.

## Usage
> ❗ **Important**: If you also have the [vscode-tslint][vscode-tslint] extension in VS Code installed, please disable it to avoid that files are linted twice.*

This extension works out of the box with VS Code's built-in version of TypeScript. You do not need to configure the plugin in your `tsconfig.json` if you are using VS Code's version of TypeScript.

If you are [using a workspace version of typescript](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions), you must currently configure the TS Server plugin manually by following [these instructions](https://github.com/Microsoft/typescript-lit-html-plugin#usage)

## Differences with the [vscode-TSLint][vscode-tslint] extension

- Configuration options for TSLint are specified [inside the `tsconfig.json`](https://github.com/Microsoft/typescript-lit-html-plugin#usage).

- The implementation as a TypeScript server plugin enables to shares the program representation with TypeScript. This is more efficient than the current vscode-tslint implementation. The current TSLint implementation needs to reanalyze a document that has already been analyzed by the TypeScript language server. 

- vscode-tslint can only lint one file a time. It therefore cannot support [semantic tslint rules](https://palantir.github.io/tslint/usage/type-checking/) that require the type checker. The language service plugin doesn't have this limitation. To overcome this limitation is a key motivation for reimplementing the extension.

- The TSLint extension bundles a tslint and typescript version. 


[vscode-tslint]: https://marketplace.visualstudio.com/items?itemName=eg2.tslint