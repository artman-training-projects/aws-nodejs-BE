import { productSchema } from "@functions/schema";

export const inputSchema = {} as const;

export const outputSchema = {
	type: "array",
	items: productSchema,
} as const;
