"use strict";

import { version, author, license } from "./package.json";
import { execSync } from "child_process";
import { terser } from "rollup-plugin-terser";
const getFirstCommitDate = () => {  
    const [, m, d, t, y] = execSync("git log --reverse").toString().match(/Date:\s+\w+\s+(\w+)\s+(\d+)\s+(\d+:\d+:\d+)\s+(\d{4})/);
    const dt = new Date(`${y}-${m}-${d} ${t} GMT`);
    return `${y}/${dt.getMonth() + 1}/${d} ${t}`;
};

const banner = `+
/**+
 * GBKCodec v${version}+
 * Author: ${author}+
 * Created: ${getFirstCommitDate()}+
 * Last Modify: ${new Date().toLocaleDateString()}+
 * License: ${license}+
 */+
`.replace(/\n+/g, "").replace(/\+/g, "\n");

const plugins = [ 
    terser({
        output: {
            comments: function (node, comment) {
                return /GBKCodec/.test(comment.value);
            }
        }
    }) 
];

export default {
    input: "src/index.mjs",
    output: [
        {
            exports: "named",
            file: "dist/esm/GBKCodec.min.mjs",
            format: "esm",
            banner,
            sourcemap: true,
            plugins
        },
        {
            exports: "named",
            file: "dist/esm/GBKCodec.mjs",
            format: "esm",
            banner,
            sourcemap: true
        },
        {
            exports: "named",
            file: "dist/cjs/GBKCodec.min.js",
            format: "cjs",
            banner,
            sourcemap: true,
            plugins
        },
        {
            exports: "named",
            file: "dist/cjs/GBKCodec.js",
            format: "cjs",
            banner,
            sourcemap: true
        },
    ]
}