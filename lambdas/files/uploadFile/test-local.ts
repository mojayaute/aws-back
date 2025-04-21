import { handler } from './index';
import { APIGatewayProxyEvent } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const boundary = '----WebKitFormBoundary' + crypto.randomBytes(16).toString('hex');

const filePath = path.resolve(__dirname, 'profile.jpeg');
const fileContent = fs.readFileSync(filePath);
const filename = 'test-image.jpg';
const contentType = 'image/jpeg';

const body = [
  `--${boundary}`,
  `Content-Disposition: form-data; name="file"; filename="${filename}"`,
  `Content-Type: ${contentType}`,
  '',
  fileContent,
  `--${boundary}--`,
].join('\r\n');

const event: APIGatewayProxyEvent = {
  body: body.toString(),
  headers: {
    'content-type': `multipart/form-data; boundary=${boundary}`,
  },
  isBase64Encoded: false,
} as any;

(async () => {
  const res = await handler(event);
  console.log('Lambda response:', res);
})();
