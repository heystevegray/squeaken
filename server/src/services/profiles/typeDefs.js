import { gql } from "apollo-server";

const typeDefs = gql`
	# This is a "stub" of the Account entity
	extend type Account @key(fields: "id") {
		id: ID! @external
		"Metadata about the user that owns this account."
		profile: Profile
	}

	"""
	Profile Entity

	A profile contains metadata about a specific user.
	"""
	type Profile @key(fields: "id") {
		"The unique MongoDB document ID of this user's profile."
		id: ID!
		"The Auth0 account tied to this profile."
		account: Account!
		"The URL of the user's avatar."
		avatar: String
		"A short bio or description about the user (max. 256 characters)."
		description: String
		"Other users that the users follows."
		following: [Profile]
		"The full name of the user."
		fullName: String
		"The unique username of the user."
		username: String!
		"Whether the currently logged in user follows this profile."
		viewerIsFollowing: Boolean
	}

	extend type Query {
		"Retrieves a single profile by username."
		profile(username: String!): Profile!

		"Retrieves a list of profiles."
		profiles: [Profile]
	}
`;

export default typeDefs;
