"use strict";

/**
 * gbk编解码器
 * 实测几乎大多数escpos、tspl打印机中文打印都仅支持GBK编码，而javascript字符编码系统使用utf16
 * 之前一直使用外部依赖的方式来解决gbk编码问题，但最近需要考虑到兼容很多平台（小程序，混合app，nodejs）
 * 然而外部依赖代码都很庞大，有很多不需要的东西也带进来了；最重要的是依赖的代码依赖nodejs环境的基础api
 */

import cp936map from "./cp936map.mjs";

const WHAT_THE_FUCK = "?".charCodeAt(0);

// 跳过ascii和部分空区
const GBK_START = 0x8140;

const errorLog = msg => `[ GBKEncode ] ${msg}`;

const endiannessKeys = [ "BE", "LE" ];

/**
 * 字符串或者utf16转换为GBK编码字节块
 *
 * @param {String|Uint8Array} source - 字符串或者utf16字节块
 * @param {String} [endianness="BE"] - 仅在source为Uint8Array时指定传入utf16的字节序
 * @return {Uint8Array}
 * @public
 */
const encode = (source, endianness = "BE") => {
    if (typeof source !== "string" && !(source instanceof Uint8Array))
        throw new Error(errorLog(`source参数必须为String或Uint8Array类型`));
    if (!endiannessKeys.includes(endianness))
        throw new Error(errorLog(`endianess只能为[${endianessHub.join("、")}]`));

    let gbCodes = [];
    // Uint8Array
    if (source instanceof Uint8Array) {
        gbCodes = source.reduce((gbCodes, byte, index) => {
            if (index % 2) {
                let uniCode = 0x00;
                let gbCode = 0x00;
                if (endianness === "BE") {
                    uniCode = (gbCodes.pop() << 8) + byte;
                } else if (endianness === "LE") {
                    uniCode = gbCodes.pop() + (byte << 8);
                }
                if (uniCode < 0x81) {
                    gbCodes.push(uniCode);
                    return gbCodes;
                }
                gbCode = cp936map.indexOf(uniCode);
                if (~gbCode) {
                    // GBK没有字节序，高字节永远在前
                    gbCode = gbCode + GBK_START;
                    gbCodes.push(...[ gbCode >>> 8, gbCode & 0xff ]);
                } else {
                    gbCodes.push(WHAT_THE_FUCK);
                }
            } else {
                gbCodes.push(byte);
            }
            return gbCodes;
        }, []);
    }
    // String
    else {
        gbCodes = Array.from(source).reduce((gbCodes, char) => {
            const unicode = char.charCodeAt();
            if (unicode < 0x81) {
                gbCodes.push(unicode);
                return gbCodes;
            }
            let gbCode = cp936map.indexOf(unicode);
            if (~unicode) {
                gbCode = gbCode + GBK_START;
                gbCodes.push(...[ gbCode >>> 8, gbCode & 0xff ]);
            } else {
                gbCodes.push(WHAT_THE_FUCK);
            }
            return gbCodes;
        }, []);
    }
    return new Uint8Array(gbCodes);
};

/**
 * GBK decode
 *
 * @param {Uint8Array} buffer  - gbk字节块
 * @param {String} [endianness="BE"] - 输出utf6字节序
 * @return {Uint8Array}
 * @public
 */
const decode = (buffer, endianness = "BE") => {
    if (!(buffer instanceof Uint8Array))
        throw new Error(errorLog(`buffer 必须为Uint8Array类型`));
    if (!endiannessKeys.includes(endianness))
        throw new Error(errorLog(`endianness 参数错误`));

    const handleEndianness = {
        BE: (preByte, code) => [ preByte, code ],
        LE: (preByte, code) => [ code, preByte ]
    };

    return new Uint8Array(
        buffer.reduce((uniCodes, byte) => {
            debugger

            /**
             * GBK兼容ascii，GBK的文档虽然说是双字节存储，实测遇到a
             * scii时候，不会如utf16一样使用至少2字节来存储，仅会使
             * 用1字节来存储。
             */
            if (byte < 0x81) {
                uniCodes.push(...handleEndianness[endianness](0X00, byte));
                return uniCodes;
            }

            const preByteType = typeof uniCodes[uniCodes.length - 1];
            if (preByteType === "string") {
                const gbCode = (Number(uniCodes.pop()) << 8) + byte;
                const uniCode = cp936map[gbCode - GBK_START];
                uniCodes.push(...handleEndianness[endianness](uniCode >>> 8, uniCode & 0xff));
            } else {
                uniCodes.push(String(byte));
            }
            return uniCodes;
        }, [])
    );
};

/***
 * GBK code to Text
 *
 * @param {Uint8Array} buffer - BGK编码字节块
 * @param {String} [endianness="BE"] - 转换为utf16时的字节序
 * @return {String}
 * @public
 */
const decodeText = (buffer, endianness = "BE") => {
    return decode(buffer, endianness).reduce((str, code, index) => {
        if (index % 2) {
            str.push(
                ...(
                    endianness === "BE" ?
                    String.fromCharCode((str.pop() << 8) + code) :
                    endianness === "LE" ?
                    String.fromCharCode(str.pop() + (code << 8)) :
                    String.fromCharCode(WHAT_THE_FUCK)
                )
            );
        } else {
            str.push(code);
        }
        return str;
    }, []).join("");
};

export {
    encode,
    decode,
    decodeText
};