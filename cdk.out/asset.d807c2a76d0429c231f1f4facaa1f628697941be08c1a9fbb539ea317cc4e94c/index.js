"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/aws-multipart-parser/dist/index.js
var require_dist = __commonJS({
  "node_modules/aws-multipart-parser/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function getValueIgnoringKeyCase(object, key) {
      var foundKey = Object.keys(object).find(function(currentKey) {
        return currentKey.toLocaleLowerCase() === key.toLowerCase();
      });
      return object[foundKey];
    }
    function getBoundary(event) {
      return getValueIgnoringKeyCase(event.headers, "Content-Type").split("=")[1];
    }
    function getBody(event) {
      if (event.isBase64Encoded) {
        return Buffer.from(event.body, "base64").toString("binary");
      }
      return event.body;
    }
    exports2.parse = function(event, spotText) {
      var boundary = getBoundary(event);
      var result = {};
      getBody(event).split(boundary).forEach(function(item) {
        if (/filename=".+"/g.test(item)) {
          result[item.match(/name=".+";/g)[0].slice(6, -2)] = {
            type: "file",
            filename: item.match(/filename=".+"/g)[0].slice(10, -1),
            contentType: item.match(/Content-Type:\s.+/g)[0].slice(14),
            content: spotText ? Buffer.from(item.slice(item.search(/Content-Type:\s.+/g) + item.match(/Content-Type:\s.+/g)[0].length + 4, -4), "binary") : item.slice(item.search(/Content-Type:\s.+/g) + item.match(/Content-Type:\s.+/g)[0].length + 4, -4)
          };
        } else if (/name=".+"/g.test(item)) {
          result[item.match(/name=".+"/g)[0].slice(6, -1)] = item.slice(item.search(/name=".+"/g) + item.match(/name=".+"/g)[0].length + 4, -4);
        }
      });
      return result;
    };
  }
});

// lambdas/files/uploadFile/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_client_s3 = require("@aws-sdk/client-s3");
var import_aws_multipart_parser = __toESM(require_dist());

// node_modules/uuid/dist/esm/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm/rng.js
var import_crypto = require("crypto");
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    (0, import_crypto.randomFillSync)(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm/native.js
var import_crypto2 = require("crypto");
var native_default = { randomUUID: import_crypto2.randomUUID };

// node_modules/uuid/dist/esm/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random ?? options.rng?.() ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    if (offset < 0 || offset + 16 > buf.length) {
      throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
    }
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// lambdas/files/uploadFile/index.ts
var s3 = new import_client_s3.S3Client({});
var BUCKET_NAME = process.env.BUCKET_NAME;
var handler = async (event) => {
  try {
    const parsed = (0, import_aws_multipart_parser.parse)(event, true);
    const file = parsed.file;
    if (!file || !file.content || !file.filename) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          // 👈 necesario para CORS
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({ message: "Missing file" })
      };
    }
    const fileName = `${v4_default()}-${file.filename}`;
    const key = `uploads/${fileName}`;
    await s3.send(new import_client_s3.PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.content,
      ContentType: file.contentType,
      ACL: "public-read"
    }));
    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // 👈 necesario para CORS
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({ url })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // 👈 necesario para CORS
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
