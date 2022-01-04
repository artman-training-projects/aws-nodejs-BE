import { handlerPath } from "@libs/handlerResolver";
import { inputSchema } from "./schema";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "get",
				path: "products/{productId}",
				documentation: {
					summary: "Get product by Id",
					requestModels: {
						"application/json": inputSchema,
					},
					methodResponses: [
						{
							statusCode: 200,
							responseModels: {
								"application/json": "ProductSchema",
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
