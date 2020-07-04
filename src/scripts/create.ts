import { prompt } from "inquirer"
import * as ora from "ora"
import * as fse from "fs-extra"

import { download } from "../utils/download"
import { CliQuestions } from "../config/question"
import { logColor, logSymbol } from "../utils/log"
import { runCommand } from "../utils/tool"

const create = async (projectName, key, value) => {
	if (!projectName) {
		console.log("Please specify the project directory:")
		logColor(" jxl create", "blue", " <project-directory>", "green")
		console.log("\n")
		console.log("For example:")
		logColor(" jxl create", "blue", " my-app", "green")
		process.exit(1)
	} else if (fse.existsSync(projectName)) {
		logSymbol("😅 The project already exists.", "error")
		process.exit(1)
	} else {
		const { template, description, author, isInstall } = await prompt(
			CliQuestions,
		)

		const spinner = ora()
		spinner.start("🚀 Start downloading template code ...")

		download(template, projectName)
			.then(() => {
				const fileName = `${projectName}/package.json`

				if (fse.existsSync(fileName)) {
					const data = fse.readFileSync(fileName).toString()
					let json = JSON.parse(data)
					json.name = projectName
					json.description = description
					json.author = author

					fse.writeFileSync(fileName, JSON.stringify(json, null, "\t"), "utf-8")

					spinner.succeed("🎉 Download successfully.\n")
					spinner.stop()
				}

				install()

				async function install() {
					if (isInstall) {
						try {
							logColor("🚀 Start installing dependencies", "blue")
							await runCommand(`cd ${projectName} && yarn`)
							logSymbol(`🎉 Installation successfully.\n`, "success")

							logColor("[INFO] Coding now...\r\n", "blue")
							logColor("         cd", "blue", `${projectName}\r\n`, "green")
							logColor(`         yarn`, "blue", "start\r\n", "green")
						} catch (err) {
							logSymbol(`❌ Installation failed. ${err}`, "error")
							process.exit(1)
						}
					} else {
						logColor("[INFO] Coding now...\r\n", "blue")
						logColor("        cd", "blue", `${projectName}\r\n`, "green")
						logColor(`        yarn\r\n`, "blue")
						logColor(`        yarn`, "blue", "start\r\n", "green")
					}
				}
			})
			.catch((err) => {
				spinner.fail(`❌ The project created fail. ${err}`)
			})
	}
}

module.exports = create
