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
const spawn = require("cross-spawn");
const inquirer_1 = require("inquirer");
const question_1 = require("../config/question");
const git_1 = require("../utils/git");
function push() {
    return __awaiter(this, void 0, void 0, function* () {
        const { commitInfo } = yield inquirer_1.prompt(question_1.CommitQuestions);
        const branch = spawn.sync('git', ['rev-parse', '--abbrev-ref', 'HEAD']).stdout.toString().replace(/\s+/, '');
        if (branch === 'HEAD') {
            git_1.commit('master', commitInfo);
        }
        else {
            git_1.commit(branch, commitInfo);
        }
    });
}
push();
