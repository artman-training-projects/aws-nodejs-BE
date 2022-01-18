import type { AWS } from "@serverless/typescript";

import { getProductsList, getProductsById, addProduct } from "@functions/index";
import { mainEnv, databaseEnv, aws } from "../.env";

const environment = { ...mainEnv, ...databaseEnv };

const serverlessConfiguration: AWS = {
	service: "product-service",
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
	functions: { getProductsList, getProductsById, addProduct },
	package: { individually: true },
	configValidationMode: "off",
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
