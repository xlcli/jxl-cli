"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fse = require("fs-extra");
const cwd = process.cwd();
const projectPkgPath = path.resolve(cwd, 'package.json');
exports.projectPkgPath = projectPkgPath;
const cliPkgPath = path.resolve(__dirname, '..', '../package.json');
exports.cliPkgPath = cliPkgPath;
const cliPkgFile = fse.readJSONSync(cliPkgPath);
exports.cliPkgFile = cliPkgFile;
