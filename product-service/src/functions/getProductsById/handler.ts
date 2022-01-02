import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/types";

import { client } from "src/database/client";
import schema from "../schema";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> =
	async (event) => {
		const { productId } = event.pathParameters;
		await client.connect();

		try {
			const product = await client.query(
				`SELECT product.id, product.title, product.description, product.price, stock.count
				FROM product, stock
					WHERE product.id='${productId}' AND product.id = stock.product_id`
			);

			if (product) {
				return formatJSONResponse({
					data: product.rows,
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
		} finally {
			client.end();
		}
	};

export const main = middyfy(getProductsById);
