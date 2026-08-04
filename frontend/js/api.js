// ==========================================
// API Configuration
// ==========================================

const API_URL = "http://localhost:5000";

// ==========================================
// PRODUCTS
// ==========================================

async function getProducts() {

    const response = await fetch(`${API_URL}/products`);

    return await response.json();

}

// ==========================================
// CART
// ==========================================

async function getCart() {

    const response = await fetch(`${API_URL}/cart`);

    return await response.json();

}

async function saveCart(cart) {

    await fetch(`${API_URL}/cart`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(cart)

    });

}

async function clearCart() {

    await fetch(`${API_URL}/cart`, {

        method: "DELETE"

    });

}

// =========================
// ORDERS
// =========================

async function placeOrderAPI(order){

    const response = await fetch(`${API_URL}/orders`,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(order)

    });

    return await response.json();

}

async function getOrders(){

    const response = await fetch(`${API_URL}/orders`);

    return await response.json();

}