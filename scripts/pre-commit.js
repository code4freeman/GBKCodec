"use strict"

const { runCmds } = require("./comm");
const chalk = require("chalk");

!async function () {
    if (!await runCmds(["npm run lint"])) {
        console.log(chalk.red("\n): 代码 eslint 检测不通过, 请检查规范！\n"));
        process.exit(1);
    } else {
        console.log(chalk.green("\n(: eslint 代码检测通过\n"));
    }
    // if (!await runCmds(["npm test"])) {
    //     console.log(chalk.red("\n): 单元测试不通过，请重新检查！"));
    //     process.exit(1);
    // } else {
    //     console.log(chalk.green("\n(: 单元测试通过"));
    // }
}();
