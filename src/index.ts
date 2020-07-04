import * as chalk from "chalk"
import * as program from "commander"

import { logColor, logTracer } from "./utils/log"
import { needUpdate, update } from "./utils/update"
import { applyCommand } from "./utils/tool"
import { cliPkgFile } from "./utils/package"
import commandMap from "./config/commander"

const nodeVersion = process.versions.node
const nodeMajor = nodeVersion.split(".")[0]

if (~~nodeMajor < 8) {
	logTracer(
		`\n    You are running Node ${nodeVersion} \n
    Create App requires Node 8 or higher. \n
    Please update your version of Node.`,
		"error",
	)

	process.exit(1)
}

if (needUpdate()) {
	update().then(() => {
		run()
	})
} else {
	run()
}

function run() {
	const commands = Object.keys(commandMap)

	const help = () => {
		logColor("\r\nUsage:", "green")
		commands.map((command) => {
			logColor(`  - ${commandMap[command].usage}`, "green")
		})
		logColor("\r", "green")
		logColor("Examples:", "magenta")
		logColor("  $ jxl --help", "magenta")
		logColor("  $ jxl --version", "magenta")
	}

	commands.map((command) => {
		program
			.command(command)
			.description(commandMap[command].description)
			.action(() => {
				switch (command) {
					case "create":
					case "deploy":
						applyCommand(command, ...process.argv.slice(3))
						break
					default:
						require(`./scripts/${command}`)
						break
				}
			})
			.allowUnknownOption()
	})

	program.usage("<command> [options]")
	program.on("--help", help)

	program
		.version(
			chalk.magenta(`version: ${cliPkgFile.version}`),
			"-v, --version",
			"version",
		)
		.parse(process.argv)

	const arg = process.argv.slice(2)
	//  jxl 不带参数时执行，把 help 信息打印出来
	if (!arg.length || !commands.includes(arg[0])) {
		program.outputHelp((txt) => {
			return chalk.yellow(txt)
		})
	}
}
