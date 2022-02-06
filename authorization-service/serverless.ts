import type { AWS } from "@serverless/typescript";

import basicAuthorizer from "@functions/basicAuthorizer";
import { mainEnv, credentials, aws } from "../.env";

const environment = { ...mainEnv, ...credentials };

const serverlessConfiguration: AWS = {
	service: "authorization-service",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild"],
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
	},
	functions: { basicAuthorizer },
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
