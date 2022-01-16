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
	> = async (request) => {
		console.log("RESPONSE", {
			statusCode: request.response.statusCode,
			body: request.response.body,
		});
	};

	const onError: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => [
		console.error("ERROR", {
			statusCode: request.response.statusCode,
			error: request.error,
		}),
	];

	return { before, after, onError };
};
