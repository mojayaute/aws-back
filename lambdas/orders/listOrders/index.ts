import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.requestContext.authorizer?.claims?.sub;

  if (!userId) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
      },
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }

  try {
    const result = await client.send(
      new QueryCommand({
        TableName: process.env.ORDERS_TABLE,
        IndexName: 'userId-index',
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // 👈 necesario para CORS
      },
      body: JSON.stringify(result.Items),
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
