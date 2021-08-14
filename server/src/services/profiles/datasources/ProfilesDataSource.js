import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import gravatarUrl from "gravatar-url";

class ProfilesDataSource extends DataSource {
	constructor({ auth0, Profile }) {
		super();
		this.auth0 = auth0;
		this.Profile = Profile;
	}

	getProfile(filter) {
		return this.Profile.findOne(filter).exec();
	}

	getProfiles() {
		return this.Profile.find({}).exec();
	}

	getProfileById(id) {
		return this.Profile.findById(id);
	}

	async checkViewerFollowsProfile(viewerAccountId, profileId) {
		const viewerProfile = await this.Profile.findOne({
			accountId: viewerAccountId,
		}).exec();
		return viewerProfile.following.includes(profileId);
	}

	async createProfile(profile) {
		const account = await this.auth0.getUser({ id: profile.accountId });
		const avatar = gravatarUrl(account.email, { default: "mm" });
		profile.avatar = avatar;
		const newProfile = new this.Profile(profile);
		return newProfile.save();
	}
}

export default ProfilesDataSource;
