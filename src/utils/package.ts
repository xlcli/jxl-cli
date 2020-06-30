import * as path from 'path';
import * as fse from 'fs-extra';

const cwd = process.cwd();

// 当前执行目录的 package.json
const projectPkgPath = path.resolve(cwd, 'package.json');

// 脚手架的 package.json
const cliPkgPath = path.resolve(__dirname, '..', '../package.json');

const cliPkgFile = fse.readJSONSync(cliPkgPath);

export {
  projectPkgPath,
  cliPkgPath,
  cliPkgFile
}
