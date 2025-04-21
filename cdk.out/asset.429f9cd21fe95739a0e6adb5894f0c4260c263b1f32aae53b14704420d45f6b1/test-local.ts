import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';
import 'dotenv/config';

(async () => {
  const event = {
    body: JSON.stringify({
      email: 'test@example.com',
      password: '123456',
      name: 'David',
    }),
  };

  const result = await handler(event as APIGatewayProxyEvent);
  console.log('Lambda response:', result);
})();
