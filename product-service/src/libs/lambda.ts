import middy from "@middy/core";
import cors from "@middy/http-cors";
import { logger } from "./middleware/logger";

export const middyfy = (handler) => {
	return middy(handler).use(logger()).use(cors());
};
