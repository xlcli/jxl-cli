// @ts-nocheck
import * as fse from "fs-extra"
import * as ora from "ora"
import * as path from "path"
import * as archiver from "archiver"
import * as path from "path"
import * as NodeSSH from "node-ssh"

import { logColor, logSymbol } from "../utils/log"

const deploy = async () => {
	const ssh = new NodeSSH()
	const projectPath = process.cwd()
	const fileName = `config/server.js`

	if (!fse.existsSync(fileName)) {
		logSymbol("😭 Please check whether it is the jxl project.", "error")
		process.exit(1)
	}

	const argv = process.argv.slice(3)

	let serverFile = require(`${projectPath}/${fileName}`)

	if (argv.length) {
		serverFile = serverFile[argv[0]]
	}

	const {
		projectName,
		template,
		buildPath,
		script,
		host,
		port,
		username,
		password,
		serverPath,
	} = serverFile

	const spinner = ora()

	// 本地构建
	function execBuild() {
		try {
			spinner.start()
			logColor("📦 正在构建中...", "blue")
			const cp = require("child_process")
			cp.execSync(script, { cwd: projectPath })
			spinner.succeed("✅ 构建完成！\n")
		} catch (err) {
			spinner.fail(`❌ 构建失败！${err}`)
			process.exit(1)
		}
	}

	// 压缩构建 dist 文件
	function startZip() {
		return new Promise((resolve, reject) => {
			if (!fse.existsSync(buildPath)) {
				spinner.fail(`❌ 未找到 ${buildPath} 文件！`)
				process.exit(1)
			}

			const distPath = path.resolve(projectPath, buildPath)
			spinner.start()
			logColor("🗜️ 正在压缩中...", "blue")
			const archive = archiver("zip", {
				zlib: { level: 9 },
			}).on("error", (err) => {
				throw err
			})

			const output = fse.createWriteStream(`${projectPath}/${buildPath}.zip`)

			output.on("close", (err) => {
				if (err) {
					spinner.fail(`❌ 文件压缩异常失败！${err}`)
					reject(err)
					process.exit(1)
				}
				spinner.succeed("✅ 文件压缩完成！\n")
				resolve()
			})

			archive.pipe(output)
			archive.directory(distPath, "/")
			archive.finalize()
		})
	}

	// 连接服务器
	async function connectSSH() {
		try {
			spinner.start()
			logColor("🔗 正在连接服务器...", "blue")
			await ssh.connect({
				host,
				port,
				username,
				password,
			})
			spinner.succeed("✅ 服务器连接完成！\n")
		} catch (err) {
			spinner.fail(`❌ 服务器连接失败！${err}`)
			process.exit(1)
		}
	}

	// 上传 zip 包
	async function uploadFile() {
		try {
			spinner.start()
			logColor("🔗 正在上传文件到服务器...", "blue")
			await ssh.putFile(
				`${projectPath}/${buildPath}.zip`,
				`${serverPath}/${buildPath}.zip`,
			)
			spinner.succeed("✅ 文件上传成功！\n")
		} catch (err) {
			spinner.fail(`❌ 文件上传失败！${err}`)
			process.exit(1)
		}
	}

	async function runCommand(command) {
		await ssh.execCommand(command, { cwd: serverPath })
	}

	// 解压 zip 包
	async function unzipFile() {
		try {
			spinner.start()
			logColor("📦 开始解压...", "blue")
			await runCommand(
				`cd ${serverPath} && unzip -o ${buildPath}.zip && rm -f ${buildPath}.zip`,
			)
			spinner.succeed("✅ 文件解压成功！\n")
		} catch (err) {
			spinner.fail(`❌ 文件解压失败！${err}`)
			process.exit(1)
		}
	}

	// 删除本地 zip 包
	async function deleteLocalZip() {
		return new Promise((resolve, reject) => {
			spinner.start()
			logColor("📦 开始删除本地zip包...", "blue")
			fse.unlink(`${projectPath}/${buildPath}.zip`, (err) => {
				if (err) {
					spinner.fail(`❌ 本地zip包删除失败！${err}`)
					reject(err)
					process.exit(1)
				}
				spinner.succeed("✅ 本地zip包删除成功！\n")
				resolve()
			})
		})
	}

	async function startExec() {
		try {
			execBuild()
			await startZip()
			await connectSSH()
			await uploadFile()
			await unzipFile()
			await deleteLocalZip()
			logSymbol(`🎉 ${projectName} 项目部署成功！`, "success")
			process.exit(0)
		} catch (err) {
			logSymbol(`💔 项目部署失败！${err}`, "error")
			process.exit(1)
		}
	}

	startExec()
}

module.exports = deploy
