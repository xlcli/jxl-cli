import * as chalk from 'chalk';
import * as program from 'commander';

program.outputHelp((txt) => {
  return chalk.yellow(txt)
});