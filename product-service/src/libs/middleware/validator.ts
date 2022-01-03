import middy from "@middy/core";
import { createError } from "@middy/util";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Ajv from "ajv";

export const validator = (
	inputSchema
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
	const before: middy.MiddlewareFn<
		APIGatewayProxyEvent,
		APIGatewayProxyResult
	> = async (request) => {
		if (!inputSchema) return;

		const ajv = new Ajv();
		const validate = ajv.compile(inputSchema);
		const valid = validate(request.event);

		if (!valid) {
			throw createError(400, JSON.stringify(validate.errors, null, 2));
		}
	};

	return {
		before,
	};
};
