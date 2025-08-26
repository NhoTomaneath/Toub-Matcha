import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = { bufferCommands: false };
        const mongoUri = `${process.env.MONGODB_URL}/ToubMatcha`;
        cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;