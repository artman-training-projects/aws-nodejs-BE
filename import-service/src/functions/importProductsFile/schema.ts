export const inputSchema = {
	type: "object",
	properties: {
		queryStringParameters: {
			type: "object",
			required: ["name"],
			properties: {
				name: {
					type: "string",
				},
			},
		},
	},
} as const;
