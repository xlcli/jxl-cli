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
const ora = require("ora");
const fse = require("fs-extra");
const download_1 = require("../utils/download");
const question_1 = require("../config/question");
const log_1 = require("../utils/log");
const tool_1 = require("../utils/tool");
const create = (projectName, key, value) => __awaiter(void 0, void 0, void 0, function* () {
    if (!projectName) {
        console.log('Please specify the project directory:');
        log_1.logColor(' jxl create', 'blue', ' <project-directory>', 'green');
        console.log('\n');
        console.log('For example:');
        log_1.logColor(' jxl create', 'blue', ' my-app', 'green');
        process.exit(1);
    }
    else if (fse.existsSync(projectName)) {
        log_1.logSymbol('😅 The project already exists.', 'error');
        process.exit(1);
    }
    else {
        const { template, description, author, isInstall } = yield inquirer_1.prompt(question_1.CliQuestions);
        const spinner = ora();
        spinner.start('🚀 Start downloading template code ...');
        download_1.download(template, projectName)
            .then(() => {
            const fileName = `${projectName}/package.json`;
            if (fse.existsSync(fileName)) {
                const data = fse.readFileSync(fileName).toString();
                let json = JSON.parse(data);
                json.name = projectName;
                json.description = description;
                json.author = author;
                fse.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
                spinner.succeed('🎉 Download successfully.\n');
                spinner.stop();
            }
            (() => __awaiter(void 0, void 0, void 0, function* () {
                if (isInstall) {
                    try {
                        log_1.logColor('🚀 Start installing dependencies', 'blue');
                        yield tool_1.runCommand(`cd ${projectName} && yarn`);
                        log_1.logSymbol(`🎉 Installation successfully.\n`, 'success');
                        log_1.logColor('[INFO] Coding now...\r\n', 'blue');
                        log_1.logColor('         cd', 'blue', `${projectName}\r\n`, 'green');
                        log_1.logColor(`         yarn`, 'blue', 'start\r\n', 'green');
                    }
                    catch (err) {
                        log_1.logSymbol(`❌ Installation failed. ${err}`, 'error');
                        process.exit(1);
                    }
                }
                else {
                    log_1.logColor('[INFO] Coding now...\r\n', 'blue');
                    log_1.logColor('        cd', 'blue', `${projectName}\r\n`, 'green');
                    log_1.logColor(`        yarn\r\n`, 'blue');
                    log_1.logColor(`        yarn`, 'blue', 'start\r\n', 'green');
                }
            }))();
        })
            .catch(err => {
            spinner.fail(`❌ The project created fail. ${err}`);
        });
    }
});
module.exports = create;
