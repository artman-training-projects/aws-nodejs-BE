import middy from "@middy/core";
import cors from "@middy/http-cors";
import httpErrorHandler from "@middy/http-error-handler";
import JsonBodyParser from "@middy/http-json-body-parser";

import { logger } from "./middleware";

export const middyfy = (handler) =>
	middy(handler)
		.use(cors({ credentials: true }))
		.use(logger())
		.use(JsonBodyParser())
		.use(httpErrorHandler());
