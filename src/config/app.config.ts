import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

export const appConfig = {
	port: parseInt(process.env.PORT ?? '3000', 10),
	mongoURI: process.env.MONGO_URI,
};
