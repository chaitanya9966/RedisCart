import client from "../redis.js";

export const getProducts = async (req, res) => {

    try {

        const data = await client.get("products");

        if (!data) {

            return res.json([]);

        }

        res.json(JSON.parse(data));

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};