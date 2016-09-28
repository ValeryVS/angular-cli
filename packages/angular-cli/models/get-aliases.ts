import * as path from 'path';

export function getAliases(
  projectRoot: string,
  appConfig: any
) {
  const aliases: any = {};

  const appRoot = path.resolve(projectRoot, appConfig.root);
  const tsConfig = require(path.resolve(appRoot, appConfig.tsconfig));

  if (tsConfig && tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    const paths = tsConfig.compilerOptions.paths;
    for (let aliasKey in paths) {
      let alias = path.resolve(appRoot, paths[aliasKey][0]);
      aliases[aliasKey] = alias;
    }
  }

  return aliases;
}
