import 'dotenv/config';
import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';

(async () => {
  const event = {
    body: JSON.stringify({
      email: 'test@example.com',
      password: '123456',
    }),
  } as APIGatewayProxyEvent;

  const response = await handler(event as APIGatewayProxyEvent);
  console.log('Lambda response:', response);
})();
