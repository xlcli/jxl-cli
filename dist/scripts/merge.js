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
const git_1 = require("../utils/git");
const log_1 = require("../utils/log");
function merge() {
    return __awaiter(this, void 0, void 0, function* () {
        const branch = git_1.getBranch();
        const gitCommands = [
            ["checkout", "master"],
            ["merge", `${branch}`],
            ["push", "-u", "origin", 'master'],
        ];
        let spawnRet = {
            status: -1,
        };
        log_1.logColor("🚀 Start merging ...", "blue");
        gitCommands.forEach((command) => {
            spawnRet = spawn.sync("git", command, {
                stdio: "inherit",
            });
            if (spawnRet.status !== 0 && spawnRet.status !== 1) {
                log_1.logColor(`【git】git ${command} 执行失败`, "red");
                return;
            }
        });
        log_1.logColor(`🎉【branch】merge ${branch} successfully.\n`, "green");
    });
}
merge();
