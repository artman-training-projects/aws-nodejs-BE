import {
	S3Client,
	GetObjectCommand,
	CopyObjectCommand,
	DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

import csvParser from "csv-parser";
import { Stream } from "stream";
import { promisify } from "util";

const awsRegion = process.env.REGION;
const awsS3 = process.env.S3;

export const S3ClientProcessing = async (eventObjectKey: string) => {
	const clientS3 = new S3Client({ region: awsRegion });
	const clientSQS = new SQSClient({ region: awsRegion });

	const getCommand = new GetObjectCommand({
		Bucket: awsS3,
		Key: eventObjectKey,
	});

	const copyCommand = new CopyObjectCommand({
		Bucket: awsS3,
		Key: eventObjectKey.replace("uploaded/", "parsed/"),
		CopySource: `${awsS3}/${eventObjectKey}`,
	});

	const deleteCommand = new DeleteObjectCommand({
		Bucket: awsS3,
		Key: eventObjectKey,
	});

	const logger = new Stream.Transform({
		objectMode: true,
		transform(row, _, cb) {
			console.log("row: ", row);
			cb(null, row);
		},
	});

	const toSQS = new Stream.Transform({
		objectMode: true,
		transform(row, _, cb) {
			const message = new SendMessageCommand({
				QueueUrl: process.env.SQS_URL,
				MessageBody: JSON.stringify(row),
			});

			clientSQS.send(message);
			cb(null, row);
		},
	});

	try {
		const { Body } = await clientS3.send(getCommand);
		const pipeline = promisify(Stream.pipeline);

		await pipeline(Body, csvParser(), logger, toSQS);

		await clientS3.send(copyCommand);
		await clientS3.send(deleteCommand);
	} catch (error) {
		throw new Error(error);
	} finally {
		clientS3.destroy();
		clientSQS.destroy();
	}
};
