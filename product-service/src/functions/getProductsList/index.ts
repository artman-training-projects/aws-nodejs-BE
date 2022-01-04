import { handlerPath } from "@libs/handlerResolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "get",
				path: "products",
				documentation: {
					summary: "Get all products",
					methodResponses: [
						{
							statusCode: 200,
							responseModels: {
								"application/json": "ProductListSchema",
							},
						},
						{
							statusCode: 404,
							responseModels: {
								"application/json": "ErrorResponse",
							},
						},
					],
				},
			},
		},
	],
};
