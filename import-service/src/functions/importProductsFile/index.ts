import { handlerPath } from "@libs/handlerResolver";
import { aws } from "../../../../.env";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "get",
				path: "import",
				cors: true,
				authorizer: {
					name: "AuthImportService",
					arn: `arn:aws:lambda:${aws.REGION}:${aws.ACCOUNT}:function:authorization-service-dev-basicAuthorizer`,
					resultTtlInSeconds: 0,
					identitySource: "method.request.header.Authorization",
					type: "token",
				},
			},
		},
	],
};
