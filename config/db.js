import mongoose from "mongoose";

let cache = global.mongoose

if(!cached){
    cached = global.mongoose = { conn: null, promise: null}
}

async function connectDB(){

    if(cache.conn){
        return cached.conn
    }

    if(!cached.promise){
        const opts = {
            bufferCommands:false
        }

        cached.promise = (await mongoose.connect('${process.env.MONGODB_URL}/ToubMatcha',opts)).then(mongoose => {
            return mongoose
        })    
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB