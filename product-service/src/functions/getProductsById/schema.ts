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
