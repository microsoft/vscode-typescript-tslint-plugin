# Change Log

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