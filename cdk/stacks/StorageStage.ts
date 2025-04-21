import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';

interface StorageStackProps extends StackProps {
  authenticatedRole: iam.Role;
}

export class StorageStack extends Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });

    this.bucket = new s3.Bucket(this, 'ProductImagesBucket', {
      bucketName: `app-product-images-${this.account}-${this.region}`,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false, // 👈 permitir políticas públicas
        restrictPublicBuckets: false,
      }),
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Permitir que usuarios autenticados suban archivos al bucket
    props.authenticatedRole.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [`${this.bucket.bucketArn}/*`],
      effect: iam.Effect.ALLOW,
    }));

    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [`${this.bucket.bucketArn}/uploads/*`],
      })
    );

  }
}
