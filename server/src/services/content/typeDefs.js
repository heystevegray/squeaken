import { gql } from "apollo-server";

const typeDefs = gql`
	"""
	An ISO 8601-encoded UTC date string.
	"""
	scalar DateTime

	"""
	The file upload type built into Apollo Server 2.0+
	"""
	scalar Upload

	"""
	A post contains content authored by a user.
	"""
	type Post implements Content {
		"The unique MongoDB document ID of the post."
		id: ID!
		"The profile of the user who authored the post."
		author: Profile!
		"The date and time the post was created."
		createdAt: DateTime!
		"Wether the post is blocked."
		isBlocked: Boolean
		"The URL of a media file associated with the content."
		media: String
		"The body content of the post (max. 256 characters)."
		text: String!
		"Replies to this post."
		replies(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: ReplyOrderByInput
		): ReplyConnection
	}

	"""
	Provides a search string to query posts by text in their body content.
	"""
	input PostSearchInput {
		"The text string to search for in the post content."
		text: String!
	}

	extend type Profile @key(fields: "id") {
		id: ID! @external
		"A list of posts written by the user."
		posts(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: PostOrderByInput
		): PostConnection
		"A list of replies written by the user."
		replies(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: ReplyOrderByInput
		): ReplyConnection
	}

	"""
	A reply contains content that is a response to another post.
	"""
	type Reply implements Content {
		"The unique MongoDB document ID of the reply."
		id: ID!
		"The profile of the user who authored the reply."
		author: Profile!
		"The date and time the reply was created."
		createdAt: DateTime!
		"Whether the reply is blocked."
		isBlocked: Boolean
		"The URL of a media file associated with the content."
		media: String
		"The parent post of the reply."
		post: Post
		"The author of the parent post of the reply."
		postAuthor: Profile
		"The body content of the reply (max. 256 characters)."
		text: String!
	}

	"""
	Sorting options for reply connections.
	"""
	enum ReplyOrderByInput {
		"Order replies ascending by creation time."
		createdAt_ASC
		"Order replies descending by creation time."
		createdAt_DESC
	}

	"""
	Provides a filter on which replies may be queried.
	"""
	input ReplyWhereInput {
		"The unique username of the user who sent the replies."
		from: String
		"The unique username of the user who received the replies."
		to: String
	}

	"""
	A list of reply edges with pagination information.
	"""
	type ReplyConnection {
		"A list of reply edges."
		edges: [ReplyEdge]
		"Information to assist with pagination."
		pageInfo: PageInfo!
	}

	"""
	A single reply node with its cursor.
	"""
	type ReplyEdge {
		"A cursor for use in pagination."
		cursor: ID!
		"A reply at the end of an edge."
		node: Reply!
	}

	"""
	Provides data to create a reply to a post.
	"""
	input CreateReplyInput {
		"The reply's media with the stream, filename, mimetype, and encoding."
		media: Upload
		"The unique MongoDB document ID if the parent post."
		postId: ID!
		"The body content of the reply (max. 256 characters)."
		text: String!
		"The unique username of the user who authored the reply."
		username: String!
	}

	"""
	Specifies common fields for posts and replies.
	"""
	interface Content {
		"The unique MongoDB document ID of the reply."
		author: Profile!
		"The data and time the reply was created."
		createdAt: DateTime!
		"Whether the reply is blocked."
		isBlocked: Boolean
		"The URL of the media file associated with the content."
		media: String
		"The body content of the reply (max. 256 characters)."
		text: String!
	}

	"""
	Provides the unique ID of an existing piece of content.
	"""
	input ContentWhereUniqueInput {
		"The unique MongoDB document ID associated with the content."
		id: ID!
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
		pageInfo: PageInfo!
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
		createdAt_DESC
	}

	"""
	Provides data to create a post.
	"""
	input CreatePostInput {
		"The post's media with the stream, filename, mimetype, and encoding."
		media: Upload
		"The body content of the post (max. 256 characters)."
		text: String!
		"The unique username of the user who authored the post."
		username: String!
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

		Default is true.
		"""
		includeBlocked: Boolean
	}

	extend type Mutation {
		"Creates a new post."
		createPost(data: CreatePostInput!): Post!

		"Deletes a post."
		deletePost(where: ContentWhereUniqueInput!): ID!

		"Creates a new reply to a post."
		createReply(data: CreateReplyInput!): Reply!

		"Deletes a reply to a post."
		deleteReply(where: ContentWhereUniqueInput!): ID!

		"Toggles the current blocked state of the post."
		togglePostBlock(where: ContentWhereUniqueInput!): Post!

		"Toggles the current blocked state of the reply."
		toggleReplyBlock(where: ContentWhereUniqueInput!): Reply!
	}

	extend type Query {
		"Retrieves a single post by MongoDB document ID."
		post(id: ID!): Post!

		"Retrieves a list of posts."
		posts(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: PostOrderByInput
			filter: PostWhereInput
		): PostConnection

		"Retrieves a single reply by MongoDB document ID."
		reply(id: ID!): Reply!

		"Retrieves a list of replies."
		replies(
			after: String
			before: String
			first: Int
			last: Int
			orderBy: ReplyOrderByInput
			filter: ReplyWhereInput!
		): ReplyConnection

		"""
		Performs a search of posts.

		Results are available in descending order by relevance only.
		"""
		searchPosts(
			after: String
			first: Int
			query: PostSearchInput!
		): PostConnection
	}
`;

export default typeDefs;
