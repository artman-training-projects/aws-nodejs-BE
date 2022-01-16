import type { AWS } from "@serverless/typescript";

import { importProductsFile, importFileParser } from "@functions/index";
import { mainEnv } from "../.env";

const environment = { ...mainEnv };

const serverlessConfiguration: AWS = {
	service: "import-service",
	frameworkVersion: "2",
	plugins: ["serverless-esbuild"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		region: "eu-west-1",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment,
		lambdaHashingVersion: "20201221",
	},
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
