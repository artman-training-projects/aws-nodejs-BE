import { products } from "./products.mock";

export const getAllProducts = async () => Promise.resolve(products);

export const getProductById = async (productId) =>
	(await getAllProducts()).find(({ id }) => id === productId);
