import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/types";

import { getAllProducts } from "src/database";
import schema from "../schema";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async () => {
		try {
			const allProducts = await getAllProducts();

			if (allProducts) {
				return formatJSONResponse({
					data: allProducts,
				});
			}

			return formatErrorResponse({
				errorMessage: "Products not found",
				statusCode: 404,
			});
		} catch (error) {
			const errorMessage =
				"Something went wrong when looking for product";
			console.error(errorMessage, error);

			return formatErrorResponse({
				errorMessage,
				statusCode: 400,
			});
		}
	};

export const main = middyfy(getProductsList);
