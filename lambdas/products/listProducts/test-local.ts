import 'dotenv/config';
import { handler } from './index';

(async () => {
  const event = {
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
