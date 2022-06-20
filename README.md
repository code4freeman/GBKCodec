# GBK编解码器

专门为了开发中遇到的外设设备开发的GBK编解码器；之前一直使用外部依赖，它们都或多或少依赖于某个   
宿主环境的基础api并且代码巨大，为了方便快捷的兼容多个平台，所以抽离了这部分代码为公共包做为su   
bmodule包含到其他项目中，方便维护。        

*💡若集成到代码体积敏感的平台，后续记得使用lz77压缩cp936map，初始化时候解析到内存。*     

---

## 🔨接口
以commonjs举例，（小程序、混合app等相同，后面会单独打包并配置于npm相关导出），
详细信息请看源码注释。  
```js
const { decode，encode，decodeText } = require("gbkcodec");

const str = "中国A";

// encdeo
const gbkBuf = encode(str);

// decode
const utf16Buf = decode(gbkBuf);

// decodeText
const text = decodeText(gbkBuf);
```

---

## 🚧注意
不处理BOM，需要自己提前处理。  
不支持utf16代理区以上的字符。  