# Change Log

## 1.3.1 - December 14, 2020
- Catch error when resolving global tslint fails. Thanks @nickjs!

## 1.3.0 - November 30, 2020
- Pick up plugin version 1.0.0
- By default, TSLint will no longer be loaded automatically from the workspace until the user takes some action. See the readme for more details.

## 1.2.2 - July 10, 2019
- Pick up plugin version 0.5.4
- Fixes disabled quick fix not having correct indent.
- Make sure we pass along packageManager to tslint runner.

## 1.2.1 - June 21, 2019
- Don't lint mjs files by default.
- Show an alert in the status bar if we detect that tslint is misconfigured. This alert only shows when you open a TS (or JS) file that we think should be linted but tslint is misconfigured in some way. 

## 1.2.0 - June 17, 2019
- Pick up tslint-plugin 0.5.0
- Update the problem matcher to support errors from TSlint 5.12 or newer. Thanks @Springrbua!
- Fix a potential cause of fix-all actions not working. Thanks @lawrence-yu!
- Hook up the `packageManager` property from the tslint plugin Thanks @ExE-Boss!

## 1.1.0 - May 21, 2019
- Help users better understand why tslint is not enabled by generating warnings if there is a `tslint.json` and the tslint library cannot be found or generates an error.
- Treat `tslint.json` as a standard `json` file by default instead of json+comments.

## 1.0.0 - February 8, 2019
- 1.0 release.

## 0.4.1 - January 31, 2019
- Fix the `fix-all` action showing up even on non-autofixable errors.

## 0.4.0 - January 23, 2019
- Pick up TS lint plugin 0.4.
- Auto fixing all errors and auto fix on save. Thanks @kondi!

## 0.3.0 - January 2, 2019
- Allow configuring `excludes`. Thanks @vemoo!

## 0.2.1 - December 14, 2018
- Fix `ignoreDefinitionFiles` defaulting to false.
- Set `enableForWorkspaceTypeScriptVersions` to allow global plugin to be loaded when using workspace version of TypeScript. This requires VS Code 1.31+.

## 0.2.0 - December 12, 2018
- Pick up plugin version 0.2.0.
- Default `alwaysShowRuleFailuresAsWarnings` to true. Set `"alwaysShowRuleFailuresAsWarnings": false` to restore the old behavior.
- Removing logic for older TS lint versions. Only TSlint5 was ever officially supported but there was still some logic for handling older tslint4.
- Don't show error in editor if `tslint` can't be found. We still log an error in the TS Server but do not generate an editor warning.

## 0.1.1 - November 27, 2018
- Fix bug that could cause TS Lint to use a different version of TypeScript than the version being used by the plugin. This would result in unexpected behavior.
- Use JS/TS extension instead of API to configure plugins.

## 0.1.0 - November 16, 2018
- Allow configuring using VS Code settings.
- Correctly observe changes to the `tsconfig`/`jsconfig`.
- Fix error that could cause duplicate tslint errors to be reported.

## 0.0.6 - November 15, 2018
- Fix potential state corruption error when using TS 3.2.

## 0.0.5 - November 14, 2018
- Fix trailing comma in schema. 
- Only make plugin schema apply if name is specified and set to `typesacript-tslint-plugin`.

## 0.0.4 - November 13, 2018
- Disables linting of js files by default. Use the `jsEnable` setting to enable this.
- Adds a schema for the plugin section of `tsconfig`/`jsconfig`.
- Bug fixes.

## 0.0.3 - November 5, 2018
- Use diagnostic as label for quick fixes
- Enable for js files included in tsconfig.

## 0.0.1 - October 23, 2018
- Initial release
