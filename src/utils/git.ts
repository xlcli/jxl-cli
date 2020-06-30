import * as path from 'path';
import * as fse from 'fs-extra';
import * as spawn from 'cross-spawn';

import { logColor } from './log';
import { projectPkgPath } from './package';

/**
 * 判断是否初始化Git
 * @returns {boolean}
 */
function isGit() {
  return fse.existsSync(path.join(projectPkgPath, '.git/HEAD'));
}

/**
* 判断远程master是否推送过
* @returns {boolean}
*/
function hasRemoteMaster() {
 const ret = spawn.sync('git', ['ls-remote', 'origin', 'refs/heads/master']);

 if (ret.stdout.toString().indexOf('heads/master') === -1) {
   return false;
 }
 return true;
}

function commit() {
  let commitFlag = true;

  // git 发布流
  const gitCommands = [
    'add *',
    `commit -m "first"`,
    `push -u origin master`
  ];

  let spawnRet = {
    status: -1
  };

  gitCommands.forEach(command => {
    if (!commitFlag) {
      return;
    }

    spawnRet = spawn.sync('git', command.split(' '), {
      stdio: 'inherit'
    });

    if (spawnRet.status !== 0 && spawnRet.status !== 1 ) {
      commitFlag = false;
      logColor(`【git】git ${command} 执行失败`, 'red');
      return;
    }
  });

  return commitFlag;
}

export {
  isGit,
  hasRemoteMaster,
  commit
}
