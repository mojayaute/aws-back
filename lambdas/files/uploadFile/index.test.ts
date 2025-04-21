import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { parse } from 'aws-multipart-parser';

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PutObjectCommand: jest.fn(),
}));

jest.mock('aws-multipart-parser', () => ({
  parse: jest.fn().mockImplementation(() => ({
    file: {
      filename: 'test.jpg',
      contentType: 'image/jpeg',
      content: Buffer.from('dummy-data'),
    },
  })),
}));

describe('uploadFile Lambda', () => {
  it('returns 200 and url on success', async () => {
    const event = { body: 'fake' } as any;
    const res = await handler(event);
    const parsed = JSON.parse(res.body);
    expect(res.statusCode).toBe(200);
    expect(parsed.url).toContain('https://');
  });

  it('returns 400 if file is missing', async () => {
    const { parse } = require('aws-multipart-parser');
    parse.mockImplementationOnce(() => ({})); // sobrescribe solo para este test

    const res = await handler({} as any);
    expect(res.statusCode).toBe(400);
  });
});
