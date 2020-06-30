import { cliPkgFile } from '../utils/package';
import { logColor } from '../utils/log';

logColor(`version: ${cliPkgFile.version}`, 'magenta');