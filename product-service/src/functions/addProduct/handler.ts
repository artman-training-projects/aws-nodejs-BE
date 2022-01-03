import { Client } from "pg";
import { formatJSONResponse, formatErrorResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { HandlerType } from "src/types";
import { DB_Config } from "src/database/config";

const addProduct: HandlerType<{
	body: {
		title: string;
		description: string;
		price: number;
		count: number;
	};
}> = async (event) => {
	const { title, description, price, count } = event.body;

	const client = new Client(DB_Config);
	await client.connect();
	await client.query("BEGIN;");

	try {
		const {
			rows: [product],
		} = await client.query(
			`INSERT INTO product (title, description, price) VALUES
			('${title}', '${description}', '${price}')
			RETURNING id, title, description, price`
		);

		const {
			rows: [stock],
		} = await client.query(
			`INSERT INTO stock (product_id, count) VALUES
			('${product.id}', '${count}')
			RETURNING count`
		);

		await client.query("COMMIT;");
		return formatJSONResponse({
			data: { ...product, ...stock },
		});
	} catch (error) {
		await client.query("ROLLBACK;");
		const errorMessage = `Something went wrong when adding new product`;
		console.error(errorMessage, error);

		return formatErrorResponse({
			errorMessage,
			statusCode: 500,
		});
	} finally {
		client.end();
	}
};

export const main = middyfy(addProduct);