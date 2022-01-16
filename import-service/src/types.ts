import type {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Handler,
} from "aws-lambda";

export type HandlerType<EventParam> = Handler<
	APIGatewayProxyEvent & EventParam,
	APIGatewayProxyResult
>;
