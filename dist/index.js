"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const program = require("commander");
const log_1 = require("./utils/log");
const update_1 = require("./utils/update");
const tool_1 = require("./utils/tool");
const package_1 = require("./utils/package");
const commander_1 = require("./config/commander");
const nodeVersion = process.versions.node;
const nodeMajor = nodeVersion.split(".")[0];
if (~~nodeMajor < 8) {
    log_1.logTracer(`\n    You are running Node ${nodeVersion} \n
    Create App requires Node 8 or higher. \n
    Please update your version of Node.`, "error");
    process.exit(1);
}
if (update_1.needUpdate()) {
    update_1.update().then(() => {
        run();
    });
}
else {
    run();
}
function run() {
    const commands = Object.keys(commander_1.default);
    const help = () => {
        log_1.logColor("\r\nUsage:", "green");
        commands.map((command) => {
            log_1.logColor(`  - ${commander_1.default[command].usage}`, "green");
        });
        log_1.logColor("\r", "green");
        log_1.logColor("Examples:", "magenta");
        log_1.logColor("  $ jxl --help", "magenta");
        log_1.logColor("  $ jxl --version", "magenta");
    };
    commands.map((command) => {
        program
            .command(command)
            .description(commander_1.default[command].description)
            .action(() => {
            switch (command) {
                case "create":
                case "deploy":
                    tool_1.applyCommand(command, ...process.argv.slice(3));
                    break;
                default:
                    require(`./scripts/${command}`);
                    break;
            }
        })
            .allowUnknownOption();
    });
    program.usage("<command> [options]");
    program.on("--help", help);
    program
        .version(chalk.magenta(`version: ${package_1.cliPkgFile.version}`), "-v, --version", "version")
        .parse(process.argv);
    const arg = process.argv.slice(2);
    if (!arg.length || !commands.includes(arg[0])) {
        program.outputHelp((txt) => {
            return chalk.yellow(txt);
        });
    }
}
