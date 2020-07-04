"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fse = require("fs-extra");
const spawn = require("cross-spawn");
const log_1 = require("./log");
const package_1 = require("./package");
function isGit() {
    return fse.existsSync(path.join(package_1.projectPkgPath, '.git/HEAD'));
}
exports.isGit = isGit;
function hasRemoteMaster() {
    const ret = spawn.sync('git', ['ls-remote', 'origin', 'refs/heads/master']);
    if (ret.stdout.toString().indexOf('heads/master') === -1) {
        return false;
    }
    return true;
}
exports.hasRemoteMaster = hasRemoteMaster;
function commit(branch, commitInfo) {
    let commitFlag = true;
    const gitCommands = [
        ['add', '.'],
        ['commit', '-m', `${commitInfo}`],
        ['push', '-u', 'origin', `${branch}`]
    ];
    let spawnRet = {
        status: -1
    };
    log_1.logColor('🚀 Start push ...', 'blue');
    gitCommands.forEach(command => {
        if (!commitFlag) {
            return;
        }
        spawnRet = spawn.sync('git', command, {
            stdio: 'inherit'
        });
        if (spawnRet.status !== 0 && spawnRet.status !== 1) {
            commitFlag = false;
            log_1.logColor(`【git】git ${command} 执行失败`, 'red');
            return;
        }
    });
    log_1.logColor(`🎉【branch】push ${branch} successfully.\n`, 'green');
    return commitFlag;
}
exports.commit = commit;
