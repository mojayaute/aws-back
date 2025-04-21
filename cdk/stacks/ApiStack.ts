import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as path from 'path';
import { PhysicalName } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';


interface ApiStackProps extends StackProps {
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient; 
  productsTable: dynamodb.Table;
  ordersTable: dynamodb.Table;
  bucket: s3.Bucket;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });

    const api = new apigateway.RestApi(this, 'AppApi', {
      restApiName: 'App Service',
      binaryMediaTypes: ['multipart/form-data'],
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'Authorizer', {
      cognitoUserPools: [props.userPool],
    });

    const createLambda = (name: string, folder: string) => {
      return new NodejsFunction(this, name, {
        entry: path.join(__dirname, `../../lambdas/${folder}/${name}/index.ts`),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        timeout: Duration.seconds(10),
        environment: {
          PRODUCTS_TABLE: props.productsTable.tableName,
          ORDERS_TABLE: props.ordersTable.tableName,
          BUCKET_NAME: props.bucket.bucketName,
        },
      });
    };
    

    // ejemplo de lambda
    const registerFn = createLambda('register', 'auth');
    registerFn.addEnvironment('COGNITO_CLIENT_ID', props.userPoolClient.userPoolClientId); // 👈 necesario
    props.bucket.grantPut(registerFn);
    props.productsTable.grantReadWriteData(registerFn);
    props.ordersTable.grantReadWriteData(registerFn);

    const auth = api.root.addResource('auth');
    auth.addResource('register').addMethod('POST', new apigateway.LambdaIntegration(registerFn));

    const loginFn = createLambda('login', 'auth');
    loginFn.addEnvironment('COGNITO_CLIENT_ID', props.userPoolClient.userPoolClientId);
    auth.addResource('login').addMethod('POST', new apigateway.LambdaIntegration(loginFn));


    const products = api.root.addResource('products');
    const createProductFn = createLambda('createProduct', 'products');
    props.productsTable.grantReadWriteData(createProductFn);
    props.bucket.grantRead(createProductFn); // opcional si usas imagen en S3
    products.addMethod('POST', new apigateway.LambdaIntegration(createProductFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const listProductsFn = createLambda('listProducts', 'products');
    props.productsTable.grant(listProductsFn, 'dynamodb:Query', 'dynamodb:GetItem');
    products.addMethod('GET', new apigateway.LambdaIntegration(listProductsFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const orders = api.root.addResource('orders');
    const createOrderFn = createLambda('createOrder', 'orders');
    props.ordersTable.grantWriteData(createOrderFn);
    orders.addMethod('POST', new apigateway.LambdaIntegration(createOrderFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const listOrdersFn = createLambda('listOrders', 'orders');
    props.ordersTable.grantReadData(listOrdersFn);
    orders.addMethod('GET', new apigateway.LambdaIntegration(listOrdersFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });


    // Upload file Lambda
    const uploadFileFn = createLambda('uploadFile', 'files');
    uploadFileFn.addEnvironment('BUCKET_NAME', props.bucket.bucketName);
    props.bucket.grantPut(uploadFileFn);

    const upload = api.root.addResource('upload');

    upload.addMethod('POST', new apigateway.LambdaIntegration(uploadFileFn), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
  }
}
