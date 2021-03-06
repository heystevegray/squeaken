import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
	accountId: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	description: {
		type: String,
		maxLength: 256,
	},
	following: [mongoose.Schema.Types.ObjectId],
	fullName: {
		type: String,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	githubUrl: {
		type: String,
	},
	isFullNameHidden: {
		type: Boolean,
		default: false,
	},
	pinnedItems: [
		{
			githubId: { type: String, required: true },
			description: { type: String },
			name: { type: String, required: true },
			primaryLanguage: { type: String },
			url: { type: String, required: true },
		},
	],
});

profileSchema.index({ fullName: "text", username: "text" });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
