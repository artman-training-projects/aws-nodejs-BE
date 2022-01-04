import { productSchema } from "@functions/schema";

export const inputSchema = {
	type: "object",
	properties: {
		body: {
			type: "object",
			required: ["title", "description", "price", "count"],
			properties: {
				title: {
					type: "string",
				},
				description: {
					type: "string",
				},
				price: {
					type: "number",
				},
				count: {
					type: "number",
				},
			},
		},
	},
} as const;

export const outputSchema = productSchema;
