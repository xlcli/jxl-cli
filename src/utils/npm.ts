import * as path from 'path';
import * as fse from 'fs-extra';

interface CommandArgs {
  packageTool: string,
  installOptions: Array<string>
}

/**
 * 获取包管理工具和参数
 * @param arg
 * @return 返回包管理工具和参数
 */
const getCommandArgs = (arg: string): CommandArgs => {
  const isYarn = fse.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
  const packageTool = isYarn ? 'yarn' : 'npm';

  let newArg;
  if(arg === '-S') {
    newArg = 'global';
  } else {
    newArg = arg === '-S' ? (isYarn ? '' : '-S') : '-D';
  }

  let installOptions = [isYarn ? 'add' : 'install', newArg];

  return {
    packageTool,
    installOptions
  }
}

/**
 * 获取包管理工具
 */
const getPkgTool = (project): string => {
  const isYarn = fse.existsSync(path.resolve(process.cwd(), `${project}/yarn.lock`));
  return isYarn ? 'yarn' : 'npm';
}

export {
  getCommandArgs,
  getPkgTool
}
