import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
	authorProfileId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	blocked: {
		type: Boolean,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	media: {
		type: String,
	},
	postAuthorProfileId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	text: {
		type: String,
		maxLength: 256,
		required: true,
	},
});

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
