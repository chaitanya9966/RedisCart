import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

const client = createClient(
  redisUrl
    ? { url: redisUrl }
    : {
        socket: {
          host: process.env.REDIS_HOST || "127.0.0.1",
          port: Number(process.env.REDIS_PORT || 6379),
          ...(process.env.REDIS_TLS === "true" ? { tls: true } : {})
        },
        ...(process.env.REDIS_PASSWORD
          ? { password: process.env.REDIS_PASSWORD }
          : {})
      }
);

client.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

await client.connect();

console.log("Redis connected successfully");

export default client;