import {
    CognitoIdentityProviderClient,
    InitiateAuthCommand,
    AuthFlowType,
  } from "@aws-sdk/client-cognito-identity-provider";
  import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
  } from 'aws-lambda';
  
  const client = new CognitoIdentityProviderClient({});
  
  export const handler = async (
    event: APIGatewayProxyEvent
  ): Promise<APIGatewayProxyResult> => {
      const body = JSON.parse(event.body || "{}");
    const { email, password } = body;
  
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
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
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
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
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
  