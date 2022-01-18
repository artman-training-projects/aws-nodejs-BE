import { handlerPath } from "@libs/handlerResolver";
import { aws } from "../../../../.env";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			s3: {
				bucket: aws.S3,
				event: "s3:ObjectCreated:*",
				rules: [{ prefix: "uploaded/" }],
				existing: true,
			},
		},
	],
};
