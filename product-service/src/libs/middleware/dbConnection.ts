import { Client } from "pg";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DB_Config } from "src/database/config";

export const dbConnection = (): middy.MiddlewareObj<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> => {
	const before: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		const client = new Client(DB_Config);
		await client.connect();

		request.context.clientContext = {
			...request.context.clientContext,
			Custom: {
				...request.context.clientContext?.Custom,
				dbClient: client,
			},
		};
	};

	const after: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		const { dbClient } = request.context.clientContext.Custom;
		dbClient.end();
	};

	const onError: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		throw createError(500, `Something went wrong with DB`, request.error);
	};

	return { before, after, onError };
};
