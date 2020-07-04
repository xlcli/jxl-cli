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
const fse = require("fs-extra");
const ora = require("ora");
const path = require("path");
const archiver = require("archiver");
const NodeSSH = require("node-ssh");
const log_1 = require("../utils/log");
const deploy = () => __awaiter(void 0, void 0, void 0, function* () {
    const ssh = new NodeSSH();
    const projectPath = process.cwd();
    const fileName = `config/server.js`;
    if (!fse.existsSync(fileName)) {
        log_1.logSymbol('😭 Please check whether it is the jxl project.', 'error');
        process.exit(1);
    }
    const argv = process.argv.slice(3);
    let serverFile = require(`${projectPath}/${fileName}`);
    if (argv.length) {
        serverFile = serverFile[argv[0]];
    }
    const { projectName, template, buildPath, script, host, port, username, password, serverPath } = serverFile;
    const spinner = ora();
    function execBuild() {
        try {
            spinner.start();
            log_1.logColor('📦 正在构建中...', 'blue');
            const cp = require("child_process");
            cp.execSync(script, { cwd: projectPath });
            spinner.succeed('✅ 构建完成！\n');
        }
        catch (err) {
            spinner.fail(`❌ 构建失败！${err}`);
            process.exit(1);
        }
    }
    function startZip() {
        return new Promise((resolve, reject) => {
            if (!fse.existsSync(buildPath)) {
                spinner.fail(`❌ 未找到 ${buildPath} 文件！`);
                process.exit(1);
            }
            const distPath = path.resolve(projectPath, buildPath);
            spinner.start();
            log_1.logColor('🗜️ 正在压缩中...', 'blue');
            const archive = archiver('zip', {
                zlib: { level: 9 },
            })
                .on('error', err => {
                throw err;
            });
            const output = fse.createWriteStream(`${projectPath}/${buildPath}.zip`);
            output.on('close', err => {
                if (err) {
                    spinner.fail(`❌ 文件压缩异常失败！${err}`);
                    reject(err);
                    process.exit(1);
                }
                spinner.succeed('✅ 文件压缩完成！\n');
                resolve();
            });
            archive.pipe(output);
            archive.directory(distPath, '/');
            archive.finalize();
        });
    }
    function connectSSH() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                spinner.start();
                log_1.logColor('🔗 正在连接服务器...', 'blue');
                yield ssh.connect({
                    host,
                    port,
                    username,
                    password
                });
                spinner.succeed('✅ 服务器连接完成！\n');
            }
            catch (err) {
                spinner.fail(`❌ 服务器连接失败！${err}`);
                process.exit(1);
            }
        });
    }
    function uploadFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                spinner.start();
                log_1.logColor('🔗 正在上传文件到服务器...', 'blue');
                yield ssh.putFile(`${projectPath}/${buildPath}.zip`, `${serverPath}/${buildPath}.zip`);
                spinner.succeed('✅ 文件上传成功！\n');
            }
            catch (err) {
                spinner.fail(`❌ 文件上传失败！${err}`);
                process.exit(1);
            }
        });
    }
    function runCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ssh.execCommand(command, { cwd: serverPath });
        });
    }
    function unzipFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                spinner.start();
                log_1.logColor('📦 开始解压...', 'blue');
                yield runCommand(`cd ${serverPath} && unzip -o ${buildPath}.zip && rm -f ${buildPath}.zip`);
                spinner.succeed('✅ 文件解压成功！\n');
            }
            catch (err) {
                spinner.fail(`❌ 文件解压失败！${err}`);
                process.exit(1);
            }
        });
    }
    function deleteLocalZip() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                spinner.start();
                log_1.logColor('📦 开始删除本地zip包...', 'blue');
                fse.unlink(`${projectPath}/${buildPath}.zip`, err => {
                    if (err) {
                        spinner.fail(`❌ 本地zip包删除失败！${err}`);
                        reject(err);
                        process.exit(1);
                    }
                    spinner.succeed('✅ 本地zip包删除成功！\n');
                    resolve();
                });
            });
        });
    }
    function startExec() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                execBuild();
                yield startZip();
                yield connectSSH();
                yield uploadFile();
                yield unzipFile();
                yield deleteLocalZip();
                log_1.logSymbol(`🎉 ${projectName} 项目部署成功！`, 'success');
                process.exit(0);
            }
            catch (err) {
                log_1.logSymbol(`💔 项目部署失败！${err}`, 'error');
                process.exit(1);
            }
        });
    }
    startExec();
});
module.exports = deploy;
