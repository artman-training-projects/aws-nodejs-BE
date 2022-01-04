import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { HandlerType } from "src/types";

const getProductsList: HandlerType<{}> = async (_, context) => {
	context.callbackWaitsForEmptyEventLoop = false;
	const { dbClient } = context.clientContext.Custom;

	try {
		const { rows: allProducts } = await dbClient.query(
			`SELECT product.id, product.title, product.description, product.price, stock.count
			FROM product, stock
			WHERE product.id = stock.product_id`
		);

		return formatJSONResponse({
			data: allProducts,
		});
	} catch {
		return formatJSONResponse({
			statusCode: 404,
			data: `Products not found`,
		});
	}
};

export const main = middyfy(getProductsList);
