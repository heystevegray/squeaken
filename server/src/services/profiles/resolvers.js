import { UserInputError } from "apollo-server";

const resolvers = {
	PinnableItem: {
		id(pinnableItem, args, context, info) {
			return pinnableItem.githubId;
		},
	},
	Profile: {
		__resolveReference(reference, { dataSources }, info) {
			return dataSources.profilesAPI.getProfileById(reference.id, info);
		},
		account(profile, args, context, info) {
			return { __typename: "Account", id: profile.accountId };

			/*
			When testing this query below:

			query GET_POSTS {
			  posts(filter: { followedBy: "username" }, first: 20) {
			    edges {
			      node {
			        id
			        text
			        author {
			          id
			          username
			          account {
			            isModerator
			          }
			        }
			      }
			    }
			  }
			}

			Specifically this part:

			 account {
	            isModerator
	          }

			I would need to change my return value to this (profile.id):

			return { __typename: "Account", id: profile.id };

			Why? Where does the value come from for `profile.id` vs `profile.accountId`?
			*/
		},
		id(profile, args, context, info) {
			return profile._id;
		},
		viewerIsFollowing(profile, args, { dataSources, user }, info) {
			return dataSources.profilesAPI.checkViewerFollowsProfile(
				user.sub,
				profile._id
			);
		},
		following(profile, args, { dataSources }, info) {
			return dataSources.profilesAPI.getFollowedProfiles(
				{
					...args,
					following: profile.following,
				},
				info
			);
		},
		username(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * TODO: Add the info object and include a projection document for Mongo DB
			 * Why is profile.username null when fetching the profile query?
			 * You are extending the Account type that's defined in the Accounts federated schema
			 */

			if (profile.username) {
				return profile.username;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => {
					/*
					 * After an account is deleted, any users that were
					 * following that account seem to have an issue loading their profile
					 * page. Navigating to a user's profile calls the GET_PROFILE_CONTENT query.
					 * This query includes the basicReply fragment, and is querying for:
					 *
					 * postAuthor {
					 *   username
					 * }
					 *
					 * An error is thrown in the Profiles service:
					 *
					 * Cannot read property 'username' of null
					 *
					 * Just return an empty string if the username is null.
					 */
					if (result) {
						return result.username;
					}
					return "";
				});
		},
		avatar(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * TODO: Add the info object and include a projection document for Mongo DB
			 */

			if (profile.avatar) {
				return profile.avatar;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.avatar);
		},
		async fullName(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * TODO: Add the info object and include a projection document for Mongo DB
			 */

			const isFullNameHidden = await dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.isFullNameHidden);

			if (
				profile.isFullNameHidden === true ||
				isFullNameHidden === true
			) {
				// Hide the full name everywhere if the user prefers to hide their full name
				return "";
			}

			if (profile.fullName) {
				return profile.fullName;
			}

			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.fullName);
		},
		description(profile, args, { dataSources }, info) {
			/*
			 * TODO: Why do I have to do this????
			 * TODO: Add the info object and include a projection document for Mongo DB
			 */

			if (profile.description) {
				return profile.description;
			}
			return dataSources.profilesAPI
				.getProfileById(profile.id)
				.then((result) => result.description);
		},
	},
	Account: {
		profile(account, args, { dataSources }, info) {
			return dataSources.profilesAPI.getProfile(
				{
					accountId: account.id,
				},
				info
			);
		},
	},
	Query: {
		async profile(parent, { username }, { dataSources }, info) {
			const profile = await dataSources.profilesAPI.getProfile(
				{
					username,
				},
				info
			);

			if (!profile) {
				throw new UserInputError("Profile does not exist.");
			}

			return profile;
		},
		profiles(parent, args, { dataSources }, info) {
			return dataSources.profilesAPI.getProfiles(args, info);
		},
		searchProfiles(
			parent,
			{ after, first, query: { text } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.searchProfiles(
				{
					after,
					first,
					searchString: text,
				},
				info
			);
		},
	},
	Mutation: {
		createProfile(parent, { data }, { dataSources }, info) {
			return dataSources.profilesAPI.createProfile(data);
		},
		updateProfile(
			parent,
			{ data, where: { username: currentUsername } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.updateProfile(currentUsername, data);
		},
		deleteProfile(parent, { where: { username } }, { dataSources }, info) {
			return dataSources.profilesAPI.deleteProfile(username);
		},
		followProfile(
			parent,
			{ data: { followingProfileId }, where: { username } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.followProfile(
				username,
				followingProfileId
			);
		},
		unfollowProfile(
			parent,
			{ data: { followingProfileId }, where: { username } },
			{ dataSources },
			info
		) {
			return dataSources.profilesAPI.unfollowProfile(
				username,
				followingProfileId
			);
		},
	},
};

export default resolvers;
