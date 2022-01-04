import { productSchema } from "@functions/schema";
import { outputSchema as plroductListSchema } from "@functions/getProductsList/schema";

export default {
	version: "1",
	title: "Books Shop API",
	description: "Books Shop API documentation",
	models: [
		{
			name: "ProductSchema",
			description: "get Products By Id",
			contentType: "application/json",
			schema: productSchema,
		},
		{
			name: "ProductListSchema",
			description: "get Products By Id",
			contentType: "application/json",
			schema: plroductListSchema,
		},
		{
			name: "ErrorResponse",
			description: "error description",
			contentType: "application/json",
			schema: {},
		},
	],
};
