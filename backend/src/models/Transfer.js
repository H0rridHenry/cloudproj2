import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema(
	{
		filename: { type: String, required: true },
		storedPath: { type: String, required: true },
		passkeyHash: { type: String, required: true },
		expiresAt: { type: Date, required: true },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
	},
	{ timestamps: true }
);

transferSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Transfer', transferSchema);


