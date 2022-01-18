import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { FromSchema } from "json-schema-to-ts";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { HandlerType } from "src/types";
import { inputSchema } from "./schema";
import { aws } from "../../../../.env";

const importProductsFile: HandlerType<FromSchema<typeof inputSchema>> = async (
	event
) => {
	const { name } = event.queryStringParameters;

	const client = new S3Client({ region: aws.REGION });

	const putCommand = new PutObjectCommand({
		Bucket: aws.S3,
		Key: `uploaded/${name}`,
		ContentType: "text/csv",
	});

	try {
		const signedUrl = await getSignedUrl(client, putCommand, {
			expiresIn: 60,
		});

		return formatJSONResponse({
			data: signedUrl,
		});
	} catch (error) {
		return formatJSONResponse({
			statusCode: 500,
			data: error.message,
		});
	}
};

export const main = middyfy(importProductsFile, inputSchema);
