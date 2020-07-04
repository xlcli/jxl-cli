"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fse = require("fs-extra");
const package_1 = require("../utils/package");
const ui = () => {
    const data = fse.readFileSync(package_1.projectPkgPath).toString();
    console.log(JSON.parse(data).description);
};
module.exports = ui;
