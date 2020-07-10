"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const tracer = require("tracer");
const symbol = require("log-symbols");
const log = console.log;
const logger = tracer.colorConsole();
const logColor = (str, color, moreStr, moreColor) => {
    if (moreStr) {
        log(chalk[color](str), chalk[moreColor](moreStr));
    }
    else {
        log(chalk[color](str));
    }
};
exports.logColor = logColor;
const logSymbol = (str, symbolType) => {
    const map = {
        info: chalk.blue(str),
        success: chalk.green(str),
        warning: chalk.yellow(str),
        error: chalk.red(str),
    };
    log(symbol[symbolType], map[symbolType]);
};
exports.logSymbol = logSymbol;
const logTracer = (str, label) => {
    logger[label](str);
};
exports.logTracer = logTracer;
