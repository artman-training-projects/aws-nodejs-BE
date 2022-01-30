import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { Handler, SQSEvent } from "aws-lambda";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { aws } from "../../../../.env";

const catalogBatchProcess: Handler<SQSEvent> = async (event, context) => {
	const { dbClient } = context.clientContext.Custom;
	const clientSNS = new SNSClient({ region: aws.REGION });

	const products = event.Records.map(({ body }) => {
		const { title, description, price, count } = JSON.parse(body);
		return { title, description, price, count };
	});

	await dbClient.query("BEGIN;");

	try {
		const uploadedProducts = [];

		for (const { title, description, price, count } of products) {
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

			uploadedProducts.push({ ...product, ...stock });
		}

		await dbClient.query("COMMIT;");

		const message = new PublishCommand({
			TopicArn: process.env.SNS_ARN,
			Subject: "Upload new products",
			Message: JSON.stringify(uploadedProducts, null, 2),
		});
		await clientSNS.send(message);

		return formatJSONResponse({
			data: uploadedProducts,
		});
	} catch (error) {
		await dbClient.query("ROLLBACK;");

		return formatJSONResponse({
			statusCode: 500,
			errorMessage: "Something went wrong with DB, rollback transaction",
		});
	} finally {
		clientSNS.destroy();
	}
};

export const main = middyfy(catalogBatchProcess);
