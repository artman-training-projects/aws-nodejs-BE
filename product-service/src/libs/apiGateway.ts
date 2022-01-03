import { ErrorResponse, Response } from "../types";

export const formatJSONResponse = (response: Response) => {
	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Method": "*",
			"Access-Control-Allow-Headers": "*",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(response.data, null, 2),
	};
};

export const formatErrorResponse = ({
	statusCode,
	errorMessage,
}: ErrorResponse) => {
	return {
		statusCode,
		body: errorMessage,
	};
};
