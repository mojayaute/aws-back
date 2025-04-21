import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const userId = event.requestContext.authorizer?.claims?.sub;
  const body = JSON.parse(event.body || '{}');
  const { name, description, imageUrl } = body;

  if (!userId || !name || !description || !imageUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing fields' }),
    };
  }

  const id = uuidv4();

  try {
    await client.send(
      new PutCommand({
        TableName: process.env.PRODUCTS_TABLE,
        Item: {
          id,
          name,
          description,
          imageUrl,
          ownerId: userId,
        },
      })
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Product created',
        productId: id,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
