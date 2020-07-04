import * as chalk from "chalk"
import * as tracer from "tracer"
import * as symbol from "log-symbols"

const log = console.log
const logger = tracer.colorConsole()

type color = "blue" | "red" | "green" | "yellow" | "magenta"
type symbolType = "info" | "success" | "warning" | "error"
type label = "log" | "trace" | "debug" | "info" | "warn" | "error"

/**
 * 打印颜色日志：blue、red、green、yellow，只有日志信息
 * @param str 日志信息
 * @param color
 */
const logColor = (
	str: string,
	color: color,
	moreStr?: string,
	moreColor?: color,
) => {
	if (moreStr) {
		log(chalk[color](str), chalk[moreColor](moreStr))
	} else {
		log(chalk[color](str))
	}
}

/**
 * 打印颜色日志：blue、red、green、yellow，只有日志信息
 * @param str 日志信息
 * @param symbolType
 */
const logSymbol = (str: string, symbolType: symbolType) => {
	const map = {
		info: chalk.blue(str),
		success: chalk.green(str),
		warning: chalk.yellow(str),
		error: chalk.red(str),
	}

	log(symbol[symbolType], map[symbolType])
}

/**
 * 打印颜色日志：log、trace、debug、info、warn、error，不仅有日志信息，还有时间
 * @param str
 * @param label
 */
const logTracer = (str: string, label: label) => {
	logger[label](str)
}

export { logColor, logTracer, logSymbol }
