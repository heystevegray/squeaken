import { ApolloServer, ApolloError } from "apollo-server";
import { applyMiddleware } from "graphql-middleware";
import { buildFederatedSchema } from "@apollo/federation";

import AccountsDataSource from "./datasources/AccountsDataSource";
import auth0 from "../../config/auth0";
import permissions from "./permissions";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { initDeleteAccountQueue } from "./queues";

(async () => {
	const port = process.env.ACCOUNTS_SERVICE_PORT;
	const deleteAccountQueue = await initDeleteAccountQueue();

	const schema = applyMiddleware(
		buildFederatedSchema([{ typeDefs, resolvers }]),
		permissions
	);

	const server = new ApolloServer({
		schema,
		context: ({ req }) => {
			const user = req.headers.user ? JSON.parse(req.headers.user) : null;
			return { user, queues: { deleteAccountQueue } };
		},
		dataSources: () => {
			return {
				accountsAPI: new AccountsDataSource({ auth0 }),
			};
		},
	});

	const { url } = await server.listen({ port }).catch((error) => {
		throw new ApolloError(error.message);
	});

	console.log(`🤖 Accounts service is ready | ${url}`);
})();
