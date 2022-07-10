"use strict"

const { writeFileSync, existsSync, readdirSync } =require("fs");
const { resolve, sep } = require("path");
const platform = require("os").platform();
const { execSync } = require("child_process");

const 
    HOOKS_SCRIPT_DIR = resolve(__dirname, "../githooks"),
    HOOKS_DIR = resolve(__dirname, "../.git/hooks"),
    IS_THIS_PROJECT = (process.env.INIT_CWD || "").endsWith(process.env.npm_package_name);

IS_THIS_PROJECT && main();

function main () {
    console.log("开始部署本地githooks >>");
    const writedScripts = [], reg = /pre-\w+(?=\.js)/;
    readdirSync(HOOKS_SCRIPT_DIR).filter(i => reg.test(i)).map(i => i.match(reg)).forEach(name => {
        const path = resolve(HOOKS_SCRIPT_DIR, name + ".js");
        if (existsSync(path)) {
            writedScripts.push(path);
            writeHookFile(name);
        }
    });
    if (writedScripts.length) {
        platform !== "win32" && execSync(`chmod -R 777 ${resolve(HOOKS_DIR)}`);
        console.log(`githooks 部署完成，共有${writedScripts.length}个hook被部署：`);
        writedScripts.forEach((path, index) => {
            console.log(`(${index + 1}) -> ${path}`);
        });
    } else {
        console.log("githooks 部署完成，没有githook被部署！");
    }
    console.log("");
}

function writeHookFile (name) {
    const path = resolve(HOOKS_DIR, String(name));
    const scriptPath = resolve(HOOKS_SCRIPT_DIR, name + ".js");
    writeFileSync(
        path,
        `#!/usr/bin/env node
        const { spawn } = require("child_process");
        const cp = spawn("node", ["${scriptPath.replaceAll("\\", "\\\\")}"], { stdio: "inherit" });
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