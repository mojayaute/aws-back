import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.claims?.sub;
  const body = JSON.parse(event.body || '{}');
  const { title, productIds } = body;

  if (!userId || !title || !Array.isArray(productIds)) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: JSON.stringify({ message: 'Missing fields' }),
    };
  }

  const id = uuidv4();

  try {
    await client.send(
      new PutCommand({
        TableName: process.env.ORDERS_TABLE,
        Item: {
          id,
          title,
          productIds,
          userId,
        },
      })
    );

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      body: JSON.stringify({ id }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
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
