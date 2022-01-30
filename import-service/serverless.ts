import type { AWS } from "@serverless/typescript";

import {
	importProductsFile,
	importFileParser,
	catalogBatchProcess,
} from "@functions/index";
import { mainEnv, databaseEnv, aws } from "../.env";

const environment = { ...mainEnv, ...databaseEnv };

const serverlessConfiguration: AWS = {
	service: "import-service",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild"],
	resources: {
		Resources: {
			SQSQueue: {
				Type: "AWS::SQS::Queue",
				Properties: {
					QueueName: aws.SQS,
				},
			},
			SNSTopic: {
				Type: "AWS::SNS::Topic",
				Properties: {
					TopicName: aws.SNS,
				},
			},
			SNSSubscription: {
				Type: "AWS::SNS::Subscription",
				Properties: {
					Endpoint: aws.SNS_Email,
					Protocol: "email",
					TopicArn: {
						Ref: "SNSTopic",
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
				Ref: "SQSQueue",
			},
			SNS_ARN: {
				Ref: "SNSTopic",
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
					`arn:aws:sqs:${aws.REGION}:${aws.ACCOUNT}:${aws.SQS}`,
				],
			},
			{
				Effect: "Allow",
				Action: "sns:*",
				Resource: [
					`arn:aws:sns:${aws.REGION}:${aws.ACCOUNT}:${aws.SNS}`,
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
