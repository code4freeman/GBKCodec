"use strict"

/**
 * 初始化githook 
 * 
 * 需要脚本目录有相应的文件才可以被正确部署。
 * 脚本问文件名字需要 githook_ 作为前缀，后面的明明参考git文档给出的hook文件名，需要有js扩展名。
 */

const { writeFileSync, existsSync, readdirSync } =require("fs");
const { parse } = require("path");
const platform = require("os").platform();
const { execSync } = require("child_process");

// 存放脚本的目录
const 
    SCRIPTS_DIR = "scripts",
    IS_THIS_PROJECT = (process.env.INIT_CWD || "").endsWith(process.env.npm_package_name);

IS_THIS_PROJECT && main();

function main () {
    console.log("开始部署本地githooks >>");
    const writedScripts = [], reg = /pre-\w+(?=\.js)/;
    readdirSync("scripts").filter(i => reg.test(i)).map(i => i.match(reg)).forEach(name => {
        const path = `${SCRIPTS_DIR}/${name}.js`;
        if (existsSync(path)) {
            writedScripts.push(path);
            writeHookFile(path);
        }
    });
    if (writedScripts.length) {
        platform !== "win32" && execSync(`chmod -R 777 .git/hooks`);
        console.log(`githooks 部署完成，共有${writedScripts.length}个hook被部署：`);
        writedScripts.forEach((path, index) => {
            console.log(`(${index + 1}) -> ${path}`);
        });
    } else {
        console.log("githooks 部署完成，没有githook被部署！");
    }
    console.log("");
}

function writeHookFile (path) {
    writeFileSync(
        `.git/hooks/${parse(path).name}`, 
        `#!/usr/bin/env node
        const { spawn } = require("child_process");
        const cp = spawn("node", ["${path}"], { stdio: "inherit" });
        cp.on("exit", code => {
            process.exit(code);
        });
        `
        .replace(/\s/, "<sign1>")
        .replace(/\n/, "<sign2>")
        .replace(/\s+/g, " ")
        .replace(/\n/g, "")
        .replace("<sign1>", " ")
        .replace("<sign2>", "\n")
    );
}