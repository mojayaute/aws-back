import * as iam from 'aws-cdk-lib/aws-iam';
import * as identitypool from '@aws-cdk/aws-cognito-identitypool-alpha';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  public readonly identityPool: identitypool.IdentityPool;
  public readonly authenticatedRole: iam.Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });
    // Cognito User Pool
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 6,
        requireDigits: true,
        requireSymbols: false,
        requireUppercase: false,
        requireLowercase: false,
      },
    });

    // App client
    this.userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool: this.userPool,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    // Rol para usuarios autenticados
    this.authenticatedRole = new iam.Role(this, 'CognitoAuthenticatedRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          'StringEquals': {
            'cognito-identity.amazonaws.com:aud': '*', // valor genérico
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    // Identity Pool sin .attachRole()
    this.identityPool = new identitypool.IdentityPool(this, 'IdentityPool', {
      identityPoolName: 'AppIdentityPool',
      authenticationProviders: {
        userPools: [
          new identitypool.UserPoolAuthenticationProvider({
            userPool: this.userPool,
            userPoolClient: this.userPoolClient,
          }),
        ],
      },
    });

    // El rol tiene permisos agregados en StorageStack
  }
}
