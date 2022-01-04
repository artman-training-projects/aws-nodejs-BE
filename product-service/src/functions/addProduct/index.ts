import { handlerPath } from "@libs/handlerResolver";
import { inputSchema } from "./schema";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: "put",
				path: "products",
				documentation: {
					summary: "Add product",
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
							statusCode: 500,
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
