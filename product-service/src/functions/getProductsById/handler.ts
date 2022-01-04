import type { FromSchema } from "json-schema-to-ts";

import { middyfy } from "@libs/lambda";
import { formatJSONResponse } from "@libs/apiGateway";
import { HandlerType } from "src/types";
import { inputSchema } from "./schema";

const getProductsById: HandlerType<FromSchema<typeof inputSchema>> = async (
	event,
	context
) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const { dbClient } = context.clientContext.Custom;
	const { productId } = event.pathParameters;

	try {
		const {
			rows: [product],
		} = await dbClient.query(
			`SELECT product.id, product.title, product.description, product.price, stock.count
			FROM product, stock
			WHERE product.id=$1 AND product.id = stock.product_id`,
			[productId]
		);

		return formatJSONResponse({
			data: product,
		});
	} catch {
		return formatJSONResponse({
			statusCode: 404,
			data: `Product width id='${productId}' not found`,
		});
	}
};

export const main = middyfy(getProductsById, inputSchema);
