import {
    CognitoIdentityProviderClient,
    SignUpCommand,
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
    const { email, password, name } = body;
  
    if (!email || !password || !name) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
        },
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
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
        },
        body: JSON.stringify({ message: "User registered" }),
      };
    } catch (err: any) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
        },
        body: JSON.stringify({ error: err.message }),
      };
    }
  };
  