import { handler } from './index';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        Items: [
          { id: '1', name: 'Product A' },
          { id: '2', name: 'Product B' },
        ],
      }),
    }),
  },
  QueryCommand: jest.fn(),
}));

process.env.PRODUCTS_TABLE = 'mock-products';

describe('listProducts Lambda', () => {
  it('returns products list for valid user', async () => {
    const event = {
      requestContext: {
        authorizer: {
          claims: { sub: 'mock-user-id' },
        },
      },
    } as any;

    const res = await handler(event);
    const parsed = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  });
});
