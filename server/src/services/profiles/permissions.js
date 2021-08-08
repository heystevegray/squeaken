import { rule, shield, and } from "graphql-shield";

const permissions = shield(
	{},
	{ debug: process.env.NODE_ENV === "development" }
);

export default permissions;
