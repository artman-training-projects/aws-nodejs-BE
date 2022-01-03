import middy from "@middy/core";
import cors from "@middy/http-cors";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import { logger } from "./middleware/logger";

export const middyfy = (handler) => {
	return middy(handler)
		.use(logger())
		.use(middyJsonBodyParser())
		.use(
			cors({
				credentials: true,
			})
		);
};
