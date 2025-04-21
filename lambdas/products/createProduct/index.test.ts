import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({}),
    }),
  },
  PutCommand: jest.fn(),
}));

// Set dummy env vars
process.env.PRODUCTS_TABLE = 'mock-products-table';
process.env.BUCKET_NAME = 'mock-bucket';

describe('createProduct Lambda', () => {
  it('returns 400 if fields are missing', async () => {
    const event = {
      body: JSON.stringify({ name: 'Incomplete' }),
      requestContext: {
        authorizer: {
          claims: { sub: 'mock-user-id' },
        },
      },
    } as any;

    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });

  it('returns 201 on valid input', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Mock Product',
        description: 'Test product',
        imageUrl: 'https://example.com/image.jpg',
      }),
      requestContext: {
        authorizer: {
          claims: { sub: 'mock-user-id' },
        },
      },
    } as any;

    const res = await handler(event);
    const parsed = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(parsed.message).toBe('Product created');
    expect(parsed.productId).toBeDefined();
  });
});
