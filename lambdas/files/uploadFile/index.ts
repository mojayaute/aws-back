import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'aws-multipart-parser';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME!;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const parsed = parse(event, true);
    const file = (parsed as any).file;

    if (!file || !file.content || !file.filename || !file.contentType) {
      return response(400, { message: 'Missing file or invalid format' });
    }

    const key = `uploads/${uuidv4()}-${file.filename}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.content,
        ContentType: file.contentType,
      })
    );

    const url = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return response(200, { url });
  } catch (err: any) {
    return response(500, { error: err.message });
  }
};

const response = (statusCode: number, body: Record<string, any>): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  },
  body: JSON.stringify(body),
});
