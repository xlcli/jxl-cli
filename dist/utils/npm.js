"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fse = require("fs-extra");
const getCommandArgs = (arg) => {
    const isYarn = fse.existsSync(path.resolve(process.cwd(), 'yarn.lock'));
    const packageTool = isYarn ? 'yarn' : 'npm';
    let newArg;
    if (arg === '-S') {
        newArg = 'global';
    }
    else {
        newArg = arg === '-S' ? (isYarn ? '' : '-S') : '-D';
    }
    let installOptions = [isYarn ? 'add' : 'install', newArg];
    return {
        packageTool,
        installOptions
    };
};
exports.getCommandArgs = getCommandArgs;
const getPkgTool = (project) => {
    const isYarn = fse.existsSync(path.resolve(process.cwd(), `${project}/yarn.lock`));
    return isYarn ? 'yarn' : 'npm';
};
exports.getPkgTool = getPkgTool;
