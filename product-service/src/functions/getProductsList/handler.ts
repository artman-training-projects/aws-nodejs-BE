import { Client } from "pg";
import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { HandlerType } from "src/types";
import { DB_Config } from "src/database/config";

const getProductsList: HandlerType<{}> = async () => {
	const client = new Client(DB_Config);
	await client.connect();

	try {
		const { rows: allProducts } = await client.query(
			`SELECT product.id, product.title, product.description, product.price, stock.count
				FROM product, stock
					WHERE product.id = stock.product_id`
		);

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
		const errorMessage = "Something went wrong when get all products";
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
