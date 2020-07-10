import { prompt } from 'inquirer'

import { CommitQuestions } from '../config/question'
import { commit, getBranch } from '../utils/git'

async function push() {
	const { commitInfo } = await prompt(CommitQuestions)

	const branch = getBranch()

	if (branch === 'HEAD') {
		commit('master', commitInfo)
	} else {
		commit(branch, commitInfo)
	}
}

push()
