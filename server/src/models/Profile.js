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
	userName: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
