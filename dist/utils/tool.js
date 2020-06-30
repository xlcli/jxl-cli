"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const npm_1 = require("./npm");
const runCommand = (command = '', args = []) => {
    const cp = require("child_process");
    return new Promise((resolve, reject) => {
        const executedCommand = cp.spawn(command, args, {
            stdio: "inherit",
            shell: true
        });
        executedCommand.on("error", error => {
            reject(error);
        });
        executedCommand.on("exit", code => {
            if (code === 0) {
                resolve();
            }
            else {
                reject();
            }
        });
    });
};
exports.runCommand = runCommand;
const isInstalled = (packageName) => {
    try {
        require.resolve(packageName);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.isInstalled = isInstalled;
const installPackage = (packageName, arg = '') => {
    const { packageTool, installOptions } = npm_1.getCommandArgs(arg);
    runCommand(packageTool, installOptions.concat(packageName))
        .then(() => {
        require(packageName);
    })
        .catch(error => {
        console.error(error);
        process.exitCode = 1;
    });
};
exports.installPackage = installPackage;
const clearConsole = () => {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};
exports.clearConsole = clearConsole;
const applyCommand = (command, ...args) => {
    require(`../scripts/${command}`)(...args);
};
exports.applyCommand = applyCommand;
