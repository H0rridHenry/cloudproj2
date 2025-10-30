import mongoose from 'mongoose';

const connectDb = async () => {
	const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secure_cloud';
	try {
		await mongoose.connect(uri, {
			serverSelectionTimeoutMS: 5000
		});
		console.log('MongoDB connected');
	} catch (err) {
		console.error('MongoDB connection error', err.message);
		process.exit(1);
	}
};

export default connectDb;


