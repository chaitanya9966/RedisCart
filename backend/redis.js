import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({

    socket: {

        host: process.env.REDIS_HOST,

        port: process.env.REDIS_PORT

    }

});

client.on("error", err => {

    console.log("Redis Error :", err);

});

await client.connect();

console.log("Redis Connected");

export default client;