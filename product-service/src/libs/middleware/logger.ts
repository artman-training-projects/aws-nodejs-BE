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
		console.log("REQUEST", {
			pathParameters: request.event.pathParameters,
			body: request.event.body,
		});
	};

	const after: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (response) => {
		console.log("RESPONSE", {
			statusCode: response.response.statusCode,
			body: response.response.body,
		});
	};

	return { before, after };
};
