# Change Log

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