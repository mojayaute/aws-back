import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    AuthFlowType,
  } from "@aws-sdk/client-cognito-identity-provider";
  import { APIGatewayProxyHandler } from "aws-lambda";
  
  const client = new CognitoIdentityProviderClient({});
  
  export const handler: APIGatewayProxyHandler = async (event) => {
    const body = JSON.parse(event.body || "{}");
    const { email, password } = body;
  
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing email or password" }),
      };
    }
  
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: process.env.COGNITO_CLIENT_ID!,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });
  
      const response = await client.send(command);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Login successful",
          accessToken: response.AuthenticationResult?.AccessToken,
          idToken: response.AuthenticationResult?.IdToken,
          refreshToken: response.AuthenticationResult?.RefreshToken,
        }),
      };
    } catch (err: any) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
  