import { APIGatewayTokenAuthorizerEvent, Handler } from "aws-lambda";

const generatePolicy = (
	principalId: string,
	Effect: string,
	Resource: string
) => ({
	principalId,
	policyDocument: {
		Version: "2012-10-17",
		Statement: [
			{
				Action: "execute-api:Invoke",
				Effect,
				Resource,
			},
		],
	},
});

const getCredentials = (authToken: string) => {
	const token = authToken.replace(/Basic\s+/, "");
	const tokenCredentials = Buffer.from(token).toString();
	const [user, password] = tokenCredentials.split(":");
	return { token, user, password };
};

const defineAccess = (user: string, password: string) => {
	const userPassword = process.env[user];
	return userPassword !== password ? "Deny" : "Allow";
};

const basicAuthorizer: Handler<APIGatewayTokenAuthorizerEvent> = async (
	event,
	_,
	callback
) => {
	const { authorizationToken, methodArn } = event;

	try {
		const { token, user, password } = getCredentials(authorizationToken);
		const effect = defineAccess(user, password);
		const policy = generatePolicy(token, effect, methodArn);
		callback(undefined, policy);
	} catch (error) {
		callback("Unauthorized: " + error.message);
	}
};

export const main = basicAuthorizer;
