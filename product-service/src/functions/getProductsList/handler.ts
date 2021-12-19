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
					data: {
						allProducts,
					},
				});
			}

			return formatErrorResponse({
				errorMessage: "Products not found",
				statusCode: 404,
			});
		} catch (error) {
			return formatErrorResponse({
				errorMessage: "Something went wrong",
				statusCode: 400,
			});
		}
	};

export const main = middyfy(getProductsList);
