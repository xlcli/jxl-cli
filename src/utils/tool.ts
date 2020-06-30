import { getCommandArgs } from './npm';

/**
 * @param {string} command 命令
 * @param {string[]} args 命令行参数
 * @returns {Promise<void>} promise
 */
const runCommand = (command: string = '', args: string[] = []): Promise<any> => {
	const cp = require("child_process");
	return new Promise((resolve, reject) => {
		const executedCommand = cp.spawn(command, args, {
			stdio: "inherit",
			shell: true
		});

		executedCommand.on("error", error => {
			reject(error);
		});

		executedCommand.on("exit", code => {
			if (code === 0) {
				resolve();
			} else {
				reject();
			}
		});
	});
};

/**
 * @param {string} packageName 包名
 * @returns {boolean} 包是否安装
 */
const isInstalled = (packageName: string): boolean => {
	try {
		require.resolve(packageName);
		return true;
	} catch (err) {
		return false;
	}
};

/**
 * 安装包
 * @param packageName 包名
 * @param arg 参数：'-S' || '-D' || 'global'
 */
const installPackage = (packageName: string, arg: string = '') => {
  const { packageTool, installOptions } = getCommandArgs(arg);

  runCommand(packageTool, installOptions.concat(packageName))
    .then(() => {
      require(packageName);
    })
    .catch(error => {
      console.error(error);
      process.exitCode = 1;
    });
}

/**
 * 清除终端日志
 */
const clearConsole = () => {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

/**
 * 加载命令行脚本
 * @param command
 * @param args
 */
const applyCommand = (command, ...args) => {
	require(`../scripts/${command}`)(...args);
}

function firstUpperCase(str: string) {
  return str.replace(/^\S/, s => s.toUpperCase());
}

export {
	runCommand,
  isInstalled,
	installPackage,
	clearConsole,
  applyCommand,
  firstUpperCase
}
