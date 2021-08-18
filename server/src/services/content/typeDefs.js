import { gql } from "apollo-server";

const typeDefs = gql`
"""
An ISO 8601-encoded UTC date string.
"""
scalar DateTime

extend type Profile @key(fields: 'id') {
	id: ID! @external
	"A list of post written by the user."
	post(
		after: String
		before: String
		first: Int
		last: Int
		orderBy: PostOrderByInput
	): PostConnection
}

"""
A post contains content authored by a user.
"""
type Post {
	"The unique MongoDB document ID of the post."
	id: ID!
	"The profile of the user who authored the post."
	author: Profile!
	"The date and time the post was created."
	createdAt: DateTime!
	"Wether the post is blocked."
	isBlocked: Boolean
	"The URL of a media file associated with the content."
	media: string
	"The body content of the post (max. 256 characters)."
	text: String!
}

"""
Information about pagination in a connection.
"""
type PageInfo {
	"The cursor to continue from when paginating forward."
	endCursor: String
	"Whether there are more items when pagination forward."
	hasNextPage: Boolean!
	"Whether there are more items when paginating backward."
	hasPreviousPage: Boolean!
	"The cursor to continue from them paginating backward."
	startCursor: String
}

"""
A list of post edges with pagination information.
"""
type PostConnection {
	"A list of post edges."
	edges: [PostEdge]
	"Information to assist with pagination."
	pageInfo: PageInfo
}

"""
A single post node with its cursor.
"""
type PostEdge {
	"A cursor for use in pagination."
	cursor: ID!
	"A post at the end of an edge."
	node: Post!
}


"""
Sorting options for the post connections.
"""
enum PostOrderByInput {
	"Order posts ascending by creation time."
	createdAt_ASC
	"Order posts descending by creation time."
	created_DESC
}

"""
Provides a filter on which posts may be queried.
"""
input PostWhereInput {
	"""
	The unique username of the user viewing post by users they follow.

	Results include their own posts.
	"""
	followedBy: String
	"""
	Whether to include posts that have been blocked by a moderator.

	Default is 'true'.
	"""
	includeBlocked: Boolean

}

extend type Query {
	"Retrieves a single post by MongoDB document ID."
	post(id: ID!): Post!

	"Retrieves a list of posts."
	posts(after: String before: String fist: Int last: Int orderBy: PostOrderByInput filter: PostWhereInput): PostConnection
}
`;

export default typeDefs;
