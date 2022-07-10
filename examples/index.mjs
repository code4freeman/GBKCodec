"use strict";

import {
    encode,
    decode,
    decodeText
} from "#GBKCodec";


// const data = new Uint8Array([ 0x2d, 0x4e, 0xfd, 0x56, 0x41, 0x00 ]); // 中国A， utf16LE
// const data = new Uint8Array([ 0x4e, 0x2d, 0x56, 0xfd, 0x00, 0x41 ]); // 中国A， utf16BE
const data = new Uint8Array([ '0xd6', '0xd0', '0xb9', '0xfa', '0x41' ]); // 中国A， GBK

const str = "中国A";
// console.log(require("iconv-lite").encode(str, "gb2312"));
// const gbkCode = encode(data);
// console.log(gbkCode);
// const s = Array.from(gbkCode).map(code => code.toString(16));
// console.log(s);

// const unicode = Array.from(decode(data, "LE")).map(c => c.toString(16));
// console.log(unicode);

const str1 = decodeText(data);
console.log(str1);