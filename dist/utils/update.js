"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const Ora = require("ora");
const spawn = require("cross-spawn");
const semver = require("semver");
const log_1 = require("./log");
const package_1 = require("./package");
const npm_1 = require("./npm");
const spinner = Ora();
const { name, version } = package_1.cliPkgFile;
let cliLatestVersion = version;
const needUpdate = () => {
    if (semver.gt(cliLatestVersion, version)) {
        return true;
    }
    return false;
};
exports.needUpdate = needUpdate;
const update = () => {
    return new Promise((resolve, reject) => {
        spinner.start('检测到版本更新，开始更新...');
        const { packageTool, installOptions } = npm_1.getCommandArgs('global');
        const iPkg = spawn(packageTool, installOptions.concat(name));
        iPkg.stdout.on('data', message => {
            spinner.text = message.toString();
        });
        iPkg.stderr.on('data', message => {
            spinner.warn(`${message.toString()}`);
        });
        iPkg.on('error', error => {
            log_1.logTracer(JSON.stringify(error), 'error');
        });
        iPkg.on('close', code => {
            if (code === 0) {
                spinner.succeed(`更新成功, 当前版本为 ${chalk.yellow(`${cliLatestVersion}`)}`);
                resolve();
            }
            else {
                spinner.fail(`更新失败, error code: ${code}`);
                reject();
            }
        });
    });
};
exports.update = update;
