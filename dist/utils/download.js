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
const downloadGit = require("download-git-repo");
const download = (templateName, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    let url = `direct:https://github.com/syqt/${templateName}-template.git`;
    return new Promise((resolve, reject) => {
        downloadGit(url, projectName, { clone: true }, (err) => {
            if (err) {
                reject(err);
                process.exit(1);
            }
            resolve();
        });
    });
});
exports.download = download;
