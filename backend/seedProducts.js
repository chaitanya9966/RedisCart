import fs from "fs";
import path from "path";
import client from "./redis.js";

const filePath = path.resolve("./data/products.json");

async function seedProducts() {

    try {

        const products = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        await client.set(
            "products",
            JSON.stringify(products)
        );

        console.log("✅ Products inserted into Redis.");

        process.exit();

    } catch (err) {

        console.error(err);

        process.exit(1);

    }

}

seedProducts();