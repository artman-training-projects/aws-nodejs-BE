import { Client } from "pg";
import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { HandlerType } from "src/types";
import { DB_Config } from "src/database/config";

const getProductsById: HandlerType<{
	pathParameters: {
		productId: string;
	};
}> = async (event) => {
	const { productId } = event.pathParameters;

	const client = new Client(DB_Config);
	await client.connect();

	try {
		const { rows: product } = await client.query(
			`SELECT product.id, product.title, product.description, product.price, stock.count
				FROM product, stock
					WHERE product.id='${productId}' AND product.id = stock.product_id`
		);

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
	} finally {
		client.end();
	}
};

export const main = middyfy(getProductsById);
