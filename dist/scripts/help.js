"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const program = require("commander");
program.outputHelp((txt) => {
    return chalk.yellow(txt);
});
