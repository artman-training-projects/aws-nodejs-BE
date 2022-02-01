import { Client } from "pg";
import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const DB_Config = {
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_NAME,
	user: process.env.PG_USER,
	password: process.env.PG_PASS,
	connectionTimeoutMillis: 5000,
};

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
		await dbClient.end();
	};

	const onError: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		const { dbClient } = request.context.clientContext.Custom;
		await dbClient.end();
		throw createError(500, `Something went wrong with DB`, request.error);
	};

	return { before, after, onError };
};
