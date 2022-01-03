import { IsNotEmpty, validate } from "class-validator";

class Product {
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	price: number;

	@IsNotEmpty()
	count: number;
}

export const validateProduct = async ({ title, description, price, count }) => {
	const productModel = new Product();
	productModel.title = title;
	productModel.description = description;
	productModel.price = price;
	productModel.count = count;

	const productErrors = await validate(productModel);

	if (productErrors.length > 0) {
		return productErrors
			.map(({ constraints }) => JSON.stringify(constraints))
			.join(",\n");
	}

	return false;
};
