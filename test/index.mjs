import { encode, decode, decodeText } from "#GBKCodec";
import assert from "assert";

const str = "中国A";
const bufUTF16LE = new Uint8Array([ 0x2d, 0x4e, 0xfd, 0x56, 0x41, 0x00 ]); // 中国A， utf16LE
const bufUTF16BE = new Uint8Array([ 0x4e, 0x2d, 0x56, 0xfd, 0x00, 0x41 ]); // 中国A， utf16BE
const bufGBK = new Uint8Array([ 0xd6, 0xd0, 0xb9, 0xfa, 0x41 ]); // 中国A， GBK

describe("GBKCodec单元测试", () => {
    it("javascript string to GBK buffer", () => {
        const gbkBuf = encode(str);
        assert.deepStrictEqual(gbkBuf, bufGBK);
    });
    it("UTF16BE buffer to GBK buffer", () => {
        const buf = encode(bufUTF16BE, "BE");
        assert.deepStrictEqual(buf, bufGBK);
    });
    it("UTF16LE buffer to GBK buffer", () => {
        const buf = encode(bufUTF16LE, "LE");
        assert.deepStrictEqual(buf, bufGBK);
    });
    it("GBK buffer to UTF16BE buffer", () => {
        const buf = decode(bufGBK, "BE");
        assert.deepStrictEqual(buf, bufUTF16BE);
    });
    it("GBK buffer to UTF16LE buffer", () => {
        const buf = decode(bufGBK, "LE");
        assert.deepStrictEqual(buf, bufUTF16LE);
    });
    it("GBK buffer to javascript string", () => {
        const s = decodeText(bufGBK);
        assert.deepStrictEqual(str, s);
    });
});
