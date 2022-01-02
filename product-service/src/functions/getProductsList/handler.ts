import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/types";

import { client } from "src/database/client";
import schema from "../schema";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async () => {
		await client.connect();

		try {
			const allProducts = await client.query(
				`SELECT product.id, product.title, product.description, product.price, stock.count
				FROM product, stock
					WHERE product.id = stock.product_id`
			);

			if (allProducts) {
				return formatJSONResponse({
					data: allProducts.rows,
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
		} finally {
			client.end();
		}
	};

export const main = middyfy(getProductsList);
