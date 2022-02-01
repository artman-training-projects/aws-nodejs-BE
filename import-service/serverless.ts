import type { AWS } from "@serverless/typescript";

import {
	importProductsFile,
	importFileParser,
	catalogBatchProcess,
} from "@functions/index";
import { mainEnv, databaseEnv, aws, awsResources } from "../.env";

const environment = { ...mainEnv, ...databaseEnv, ...aws };

const serverlessConfiguration: AWS = {
	service: "import-service",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild"],
	resources: {
		Resources: {
			[awsResources.SQS.serviceName]: {
				Type: "AWS::SQS::Queue",
				Properties: {
					QueueName: awsResources.SQS.queueName,
				},
			},
			[awsResources.SNS.serviceName]: {
				Type: "AWS::SNS::Topic",
				Properties: {
					TopicName: awsResources.SNS.topicName,
				},
			},
			[awsResources.SNS.subscription]: {
				Type: "AWS::SNS::Subscription",
				Properties: {
					Endpoint: awsResources.SNS.email,
					Protocol: "email",
					TopicArn: {
						Ref: awsResources.SNS.serviceName,
					},
				},
			},
		},
	},
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		region: aws.REGION,
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			...environment,
			SQS_URL: {
				Ref: awsResources.SQS.serviceName,
			},
			SNS_ARN: {
				Ref: awsResources.SNS.serviceName,
			},
		},
		lambdaHashingVersion: "20201221",
		iamRoleStatements: [
			{
				Effect: "Allow",
				Action: "s3:ListBucket",
				Resource: [`arn:aws:s3:::${aws.S3}`],
			},
			{
				Effect: "Allow",
				Action: "s3:*",
				Resource: [`arn:aws:s3:::${aws.S3}/*`],
			},
			{
				Effect: "Allow",
				Action: "sqs:*",
				Resource: [
					`arn:aws:sqs:${aws.REGION}:${aws.ACCOUNT}:${awsResources.SQS.queueName}`,
				],
			},
			{
				Effect: "Allow",
				Action: "sns:*",
				Resource: [
					`arn:aws:sns:${aws.REGION}:${aws.ACCOUNT}:${awsResources.SNS.topicName}`,
				],
			},
		],
	},
	functions: { importProductsFile, importFileParser, catalogBatchProcess },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: true,
			sourcemap: true,
			exclude: ["aws-sdk", "pg-native"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
