import {
    CognitoIdentityProviderClient,
    SignUpCommand,
  } from "@aws-sdk/client-cognito-identity-provider";
  
  import { APIGatewayProxyHandler } from "aws-lambda";
  
  const client = new CognitoIdentityProviderClient({});
  
  export const handler: APIGatewayProxyHandler = async (event) => {
    const body = JSON.parse(event.body || "{}");
    const { email, password, name } = body;
  
    if (!email || !password || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }
  
    try {
      const command = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID!,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
        ],
      });
  
      await client.send(command);
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User registered" }),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
  