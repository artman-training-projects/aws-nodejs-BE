import { ErrorResponse, Response } from "./types";

export const formatJSONResponse = (response: Response) => {
	return {
		statusCode: 200,
		body: JSON.stringify(response),
	};
};

export const formatErrorResponse = ({
	statusCode,
	errorMessage,
}: ErrorResponse) => {
	return {
		statusCode,
		body: JSON.stringify(errorMessage),
	};
};
