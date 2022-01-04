import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import Ajv from "ajv";

import { formatJSONResponse } from "@libs/apiGateway";

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
			return formatJSONResponse({
				statusCode: 400,
				data: validate.errors,
			});
		}
	};

	return {
		before,
	};
};
