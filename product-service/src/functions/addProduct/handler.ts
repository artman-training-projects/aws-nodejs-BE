import type { FromSchema } from "json-schema-to-ts";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import { HandlerType } from "src/types";
import { inputSchema } from "./schema";

const addProduct: HandlerType<FromSchema<typeof inputSchema>> = async (
	event,
	context
) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const { dbClient } = context.clientContext.Custom;
	const { title, description, price, count } = event.body;

	await dbClient.query("BEGIN;");

	try {
		const {
			rows: [product],
		} = await dbClient.query(
			`INSERT INTO product (title, description, price) VALUES
			($1, $2, $3)
			RETURNING id, title, description, price`,
			[title, description, price]
		);

		const {
			rows: [stock],
		} = await dbClient.query(
			`INSERT INTO stock (product_id, count) VALUES
			($1, $2)
			RETURNING count`,
			[product.id, count]
		);

		await dbClient.query("COMMIT;");
		return formatJSONResponse({
			data: { ...product, ...stock },
		});
	} catch (error) {
		await dbClient.query("ROLLBACK;");

		return formatJSONResponse({
			statusCode: 500,
			errorMessage: "Something went wrong with DB, rollback transaction",
		});
	}
};

export const main = middyfy(addProduct, inputSchema);
