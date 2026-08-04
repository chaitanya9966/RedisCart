import client from "../redis.js";

// ---------------------------
// GET CART
// ---------------------------

export const getCart = async (req, res) => {

    try {

        const data = await client.get("cart");

        if (!data) {

            return res.json([]);

        }

        res.json(JSON.parse(data));

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// ---------------------------
// SAVE CART
// ---------------------------

export const saveCart = async (req, res) => {

    try {

        const cart = req.body;

        await client.set(

            "cart",

            JSON.stringify(cart)

        );

        res.json({

            success: true,

            message: "Cart Saved"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

// ---------------------------
// DELETE CART
// ---------------------------

export const clearCart = async (req, res) => {

    try {

        await client.del("cart");

        res.json({

            success: true,

            message: "Cart Cleared"

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};