import { productSchema } from "@functions/schema";

export const inputSchema = {
	type: "object",
	properties: {
		pathParameters: {
			type: "object",
			required: ["productId"],
			properties: {
				productId: {
					type: "string",
				},
			},
		},
	},
} as const;

export const outputSchema = productSchema;
