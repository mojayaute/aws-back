import { App } from 'aws-cdk-lib';
import { AuthStack } from '../stacks/AuthStack';
import { DatabaseStack } from '../stacks/DatabaseStack';
import { StorageStack } from '../stacks/StorageStage';
import { ApiStack } from '../stacks/ApiStack';

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Stack de autenticación
const authStack = new AuthStack(app, 'AuthStack', { env });

// Stack de base de datos
const dbStack = new DatabaseStack(app, 'DatabaseStack', { env });


// Stack de almacenamiento
const storageStack = new StorageStack(app, 'StorageStack', {
  env,
  authenticatedRole: authStack.authenticatedRole,
});
// Stack de AP
new ApiStack(app, 'ApiStack', {
  env,
  userPool: authStack.userPool,
  userPoolClient: authStack.userPoolClient,
  productsTable: dbStack.productsTable,
  ordersTable: dbStack.ordersTable,
  bucket: storageStack.bucket,
});
