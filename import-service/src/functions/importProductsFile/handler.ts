import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { HandlerType } from "src/types";

const importProductsFile: HandlerType<{}> = async () => {
	return formatJSONResponse({});
};

export const main = middyfy(importProductsFile);
