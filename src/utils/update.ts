import * as chalk from 'chalk';
import * as Ora from 'ora';
import * as spawn from 'cross-spawn';
import * as semver from 'semver';

import { logTracer } from './log';
import { cliPkgFile } from './package';
import { getCommandArgs } from './npm';

const spinner = Ora();
const { name, version } = cliPkgFile;

// let cliLatestVersion = spawn.sync('npm', ['view', name, 'version']).stdout.toString().trim() || version;
let cliLatestVersion = version;

/**
 * 比较本地 cli 版本和远程版本，是否需要更新 cli
 * @return boolean
 */
const needUpdate = (): boolean => {
  if (semver.gt(cliLatestVersion, version)) {
    return true;
  }
  return false;
};

/**
 * 更新 cli 包
 * @return Promise
 */
const update = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    spinner.start('检测到版本更新，开始更新...');

    const { packageTool, installOptions } = getCommandArgs('global');

    const iPkg = spawn(packageTool, installOptions.concat(name));
    
    iPkg.stdout.on('data', message => {
      spinner.text = message.toString();
    });

    iPkg.stderr.on('data', message => {
      spinner.warn(`${message.toString()}`);
    });

    iPkg.on('error', error => {
      logTracer(JSON.stringify(error), 'error');
    });

    iPkg.on('close', code => {
      if (code === 0) {
        spinner.succeed(`更新成功, 当前版本为 ${chalk.yellow(`${cliLatestVersion}`)}`);
        resolve();
      } else {
        spinner.fail(`更新失败, error code: ${code}`);
        reject();
      }
    })
  })
}
export {
  needUpdate,
  update
}