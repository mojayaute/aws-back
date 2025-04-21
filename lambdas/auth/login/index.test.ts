import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('@aws-sdk/client-cognito-identity-provider', () => {
  const original = jest.requireActual('@aws-sdk/client-cognito-identity-provider');
  return {
    ...original,
    CognitoIdentityProviderClient: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue({
        AuthenticationResult: {
          IdToken: 'mock-id-token',
          AccessToken: 'mock-access-token',
          RefreshToken: 'mock-refresh-token',
        },
      }),
    })),
    InitiateAuthCommand: jest.fn(),
  };
});

describe('login Lambda', () => {
  it('returns 400 if fields are missing', async () => {
    const event = {
      body: JSON.stringify({ email: 'test@example.com' }),
    } as APIGatewayProxyEvent;

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it('returns 200 and tokens on valid input (mocked)', async () => {
    process.env.COGNITO_CLIENT_ID = 'dummy-id';

    const event = {
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
      }),
    } as APIGatewayProxyEvent;

    const res = await handler(event);
    const parsed = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(parsed.idToken).toBe('mock-id-token');
    expect(parsed.accessToken).toBe('mock-access-token');
    expect(parsed.refreshToken).toBe('mock-refresh-token');
  });
});
