import * as cdk from 'aws-cdk-lib';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class ParameterStoreExtensionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parameter = new StringParameter(this, "AParameter", {
      stringValue: "My Value"
    });

    const layer = LayerVersion.fromLayerVersionArn(this, "paramLayer", "arn:aws:lambda:eu-west-1:015030872274:layer:AWS-Parameters-and-Secrets-Lambda-Extension:2");

    const retriever = new NodejsFunction(this, "function", {
      functionName: "ryan-cdk-param-extension",
      logRetention: RetentionDays.ONE_DAY,
      entry: `functions/retriever.ts`,
      environment: {
        PARAM_NAME: parameter.parameterName
      },
      layers: [layer]
    });

    parameter.grantRead(retriever);
  }
}
