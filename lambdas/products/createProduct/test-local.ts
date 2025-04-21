import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';
import 'dotenv/config';

(async () => {
  const event = {
    body: JSON.stringify({
      name: 'Local product',
      description: 'Product created locally',
      imageUrl: 'https://example.com/img.jpg',
    }),
    requestContext: {
      authorizer: {
        claims: {
          sub: 'mock-user-id',
        },
      },
    },
  } as any;

  const response = await handler(event);
  console.log('Lambda response:', response);
})();
