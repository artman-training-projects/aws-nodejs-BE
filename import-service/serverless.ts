import type { AWS } from "@serverless/typescript";

import { importProductsFile, importFileParser } from "@functions/index";
import { mainEnv, aws } from "../.env";

const environment = { ...mainEnv };

const serverlessConfiguration: AWS = {
	service: "import-service",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild"],
	// plugins: ["serverless-esbuild", "serverless-deployment-bucket"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		region: aws.REGION,
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment,
		lambdaHashingVersion: "20201221",
		// deploymentBucket: {
		// 	name: "aws.S3",
		// 	blockPublicAccess: true,
		// },
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
		],
	},
	// resources: {
	// 	Resources: {
	// 		WebAppS3Bucket: {
	// 			Type: "AWS::S3::Bucket",
	// 		},
	// 		WebAppS3BucketPolicy: {
	// 			Type: "AWS::S3::BucketPolicy",
	// 		},
	// 	},
	// },
	functions: { importProductsFile, importFileParser },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: true,
			sourcemap: true,
			exclude: ["aws-sdk"],
			target: "node14",
			define: { "require.resolve": undefined },
			platform: "node",
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
