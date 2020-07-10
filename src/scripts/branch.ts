import { prompt } from 'inquirer'
import * as fse from 'fs-extra'

import { BranchQuestion } from '../config/question'
import { projectPkgPath } from '../utils/package'
import { logSymbol } from '../utils/log'
import { runCommand } from '../utils/tool'

async function branch() {
	const { branchType } = await prompt(BranchQuestion)

	const data = fse.readFileSync(projectPkgPath).toString()
	let branch = JSON.parse(data).version

	let branchName = branch.split('.')

	branchName[branchType] = String(Number(branchName[branchType]) + 1)

	let newBranch = branchName.join('.')

	try {
		await runCommand(`git checkout -b daily/${newBranch}`)
	} catch (err) {
		logSymbol(`❌ checkout new branch. ${err}`, 'error')
		process.exit(1)
	}

	if (fse.existsSync(projectPkgPath)) {
		const data = fse.readFileSync(projectPkgPath).toString()
		let json = JSON.parse(data)
		json.version = newBranch

		fse.writeFileSync(projectPkgPath, JSON.stringify(json, null, '\t'), 'utf-8')

		logSymbol(`🎉 Installation successfully.\n`, 'success')
	} else {
		logSymbol(`❌ 本地 package.json 文件 不存在.`, 'error')
	}
}

branch()
