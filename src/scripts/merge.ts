import * as spawn from 'cross-spawn'
import { getBranch } from '../utils/git'
import { logColor } from '../utils/log'

async function merge() {
	const branch = getBranch()

	// merge 发布流
	const gitCommands = [
		['checkout', 'master'],
		['merge', `${branch}`],
		['push', '-u', 'origin', 'master'],
	]

	let spawnRet = {
		status: -1,
	}

	logColor('🚀 Start merging ...', 'blue')

	gitCommands.forEach((command) => {
		spawnRet = spawn.sync('git', command, {
			stdio: 'inherit',
		})

		if (spawnRet.status !== 0 && spawnRet.status !== 1) {
			logColor(`【git】git ${command} 执行失败`, 'red')
			return
		}
	})

	logColor(`🎉【branch】merge ${branch} successfully.\n`, 'green')
}

merge()
