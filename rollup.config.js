"use strict";

const { version, author, license } = require("./package");
const banner = `+
/**+
 * Parseenv v${version}+
 * Author ${author}+
 * Last-Modify ${new Date().toLocaleDateString()}+
 * License ${license}+
 */+
`;

export default {
    input: "src/main.js",
    external: [
        "url",
        "path",
        "http",
        "https",
        "fs"
    ],
    output: [
        {
            exports: "default",
            file: "dist/parseenv.js",
            format: "cjs",
            banner: banner.replace(/\n+/g, "").replace(/\+/g, "\n"),
            sourcemap: true
        },
        {
            exports: "default",
            file: "dist/parseenv.mjs",
            format: "esm",
            banner: banner.replace(/\n+/g, "").replace(/\+/g, "\n"),
            sourcemap: true
        },
    ]
}