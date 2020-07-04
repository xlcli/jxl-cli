import * as spawn from "cross-spawn"
import { prompt } from "inquirer"

import { CommitQuestions } from "../config/question"
import { commit } from "../utils/git"

async function push() {
	const { commitInfo } = await prompt(CommitQuestions)

	const branch = spawn
		.sync("git", ["rev-parse", "--abbrev-ref", "HEAD"])
		.stdout.toString()
		.replace(/\s+/, "")

	if (branch === "HEAD") {
		commit("master", commitInfo)
	} else {
		commit(branch, commitInfo)
	}
}

push()
