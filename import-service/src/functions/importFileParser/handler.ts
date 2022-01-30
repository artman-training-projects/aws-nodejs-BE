import { S3Event } from "aws-lambda";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { HandlerType } from "src/types";

import { S3ClientProcessing } from "./S3CLient";

const importFileParser: HandlerType<S3Event> = async (event) => {
	const { Records } = event;
	const eventObjectKey = Records[0].s3.object.key;

	try {
		await S3ClientProcessing(eventObjectKey);

		return formatJSONResponse({
			data: "File uploaded and parsed",
		});
	} catch (error) {
		return formatJSONResponse({
			statusCode: 500,
			data: error.message,
		});
	}
};

export const main = middyfy(importFileParser);
