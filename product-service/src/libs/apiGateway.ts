export interface Response {
	statusCode?: number;
	[key: string]: unknown;
}
export const formatJSONResponse = ({ statusCode = 200, data }: Response) => {
	return {
		statusCode,
		body: JSON.stringify(data, null, 2),
	};
};
