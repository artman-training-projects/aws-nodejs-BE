import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/types";

import { getProductById } from "src/database";
import schema from "../schema";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		const { productId } = event.pathParameters;

		try {
			const product = await getProductById(productId);

			if (product) {
				return formatJSONResponse({
					data: product,
				});
			}

			return formatErrorResponse({
				errorMessage: "Product not found",
				statusCode: 404,
			});
		} catch (error) {
			const errorMessage = `Something went wrong when looking for product: ${productId}`;
			console.error(errorMessage, error);

			return formatErrorResponse({
				errorMessage,
				statusCode: 500,
			});
		}
	};

export const main = middyfy(getProductsById);
