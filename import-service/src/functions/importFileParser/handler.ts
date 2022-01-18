import {
	S3Client,
	GetObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";

import csvParser from "csv-parser";
import { Stream } from "stream";
import { promisify } from "util";

import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { HandlerType } from "src/types";
import { aws } from "../../../../.env";

const importFileParser: HandlerType<S3Event> = async (event) => {
	const { Records } = event;

	const eventObjectKey = Records[0].s3.object.key;

	const client = new S3Client({ region: aws.REGION });

	const getCommand = new GetObjectCommand({
		Bucket: aws.S3,
		Key: eventObjectKey,
	});

	const copyCommand = new CopyObjectCommand({
		Bucket: aws.S3,
		Key: eventObjectKey.replace("uploaded/", "parsed/"),
		CopySource: `${aws.S3}/${eventObjectKey}`,
	});

	const deleteCommand = new DeleteObjectCommand({
		Bucket: aws.S3,
		Key: eventObjectKey,
	});

	const loggerStream = new Stream.Transform({
		objectMode: true,
		transform(row, _, cb) {
			console.log("row: ", row);
			cb(null, row);
		},
	});

	try {
		const { Body } = await client.send(getCommand);

		const pipeline = promisify(Stream.pipeline);
		await pipeline(Body, csvParser(), loggerStream);

		await client.send(copyCommand);
		await client.send(deleteCommand);

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
