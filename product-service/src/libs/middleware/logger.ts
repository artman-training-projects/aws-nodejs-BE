import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const logger = (): middy.MiddlewareObj<
	APIGatewayProxyEvent,
	APIGatewayProxyResult
> => {
	const before: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		console.log("REQUEST", request);
	};

	const after: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (response) => {
		console.log("RESPONSE", response);
	};

	return { before, after };
};
