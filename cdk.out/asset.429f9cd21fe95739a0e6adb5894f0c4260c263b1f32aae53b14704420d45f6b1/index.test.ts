import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  const original = jest.requireActual('@aws-sdk/client-cognito-identity-provider');
  return {
    ...original,
    CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({}),
    })),
    SignUpCommand: jest.fn(),
  };
});

describe('register Lambda', () => {
  it('returns 400 if fields are missing', async () => {
    const event = {
      body: JSON.stringify({ email: 'a@test.com' }),
    } as APIGatewayProxyEvent;

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it('returns 200 with valid input (mocked)', async () => {
    process.env.COGNITO_CLIENT_ID = 'dummy-id';

    const event = {
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
        name: 'David',
      }),
    } as APIGatewayProxyEvent;

    const res = await handler(event);
    expect(res.statusCode).toBe(200);
  });
});
