"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lambdas/auth/login/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_client_cognito_identity_provider = require("@aws-sdk/client-cognito-identity-provider");
var client = new import_client_cognito_identity_provider.CognitoIdentityProviderClient({});
var handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const { email, password } = body;
  if (!email || !password) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // 👈 necesario para CORS
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ message: "Missing email or password" })
    };
  }
  try {
    const command = new import_client_cognito_identity_provider.InitiateAuthCommand({
      AuthFlow: import_client_cognito_identity_provider.AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });
    const response = await client.send(command);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // 👈 necesario para CORS
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "Login successful",
        accessToken: response.AuthenticationResult?.AccessToken,
        idToken: response.AuthenticationResult?.IdToken,
        refreshToken: response.AuthenticationResult?.RefreshToken
      })
    };
  } catch (err) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        // 👈 necesario para CORS
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
