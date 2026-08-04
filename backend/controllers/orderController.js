import client from "../redis.js";

// ===========================
// PLACE ORDER
// ===========================

export const placeOrder = async (req, res) => {

    try {

        const order = req.body;

        const data = await client.get("orders");

        let orders = [];

        if (data) {

            orders = JSON.parse(data);

        }

        order.id = Date.now();

        order.date = new Date().toLocaleString();

        orders.push(order);

        await client.set(

            "orders",

            JSON.stringify(orders)

        );

        await client.del("cart");

        res.json({

            success: true,

            message: "Order Placed"

        });

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

};

// ===========================
// GET ORDERS
// ===========================

export const getOrders = async(req,res)=>{

    try{

        const data = await client.get("orders");

        if(!data){

            return res.json([]);

        }

        res.json(JSON.parse(data));

    }

    catch(err){

        res.status(500).json({

            message:err.message

        });

    }

};