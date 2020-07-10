"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const fse = require("fs-extra");
const question_1 = require("../config/question");
const package_1 = require("../utils/package");
const log_1 = require("../utils/log");
const tool_1 = require("../utils/tool");
function branch() {
    return __awaiter(this, void 0, void 0, function* () {
        const { branchType } = yield inquirer_1.prompt(question_1.BranchQuestion);
        const data = fse.readFileSync(package_1.projectPkgPath).toString();
        let branch = JSON.parse(data).version;
        let branchName = branch.split('.');
        branchName[branchType] = String(Number(branchName[branchType]) + 1);
        let newBranch = branchName.join('.');
        try {
            yield tool_1.runCommand(`git checkout -b daily/${newBranch}`);
        }
        catch (err) {
            log_1.logSymbol(`❌ checkout new branch. ${err}`, "error");
            process.exit(1);
        }
        if (fse.existsSync(package_1.projectPkgPath)) {
            const data = fse.readFileSync(package_1.projectPkgPath).toString();
            let json = JSON.parse(data);
            json.version = newBranch;
            fse.writeFileSync(package_1.projectPkgPath, JSON.stringify(json, null, '\t'), 'utf-8');
            log_1.logSymbol(`🎉 Installation successfully.\n`, 'success');
        }
        else {
            log_1.logSymbol(`❌ 本地 package.json 文件 不存在.`, 'error');
        }
    });
}
branch();
