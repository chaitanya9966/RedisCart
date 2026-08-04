// ==========================================
// RedisCart - Checkout Page
// ==========================================

let cart = [];

document.addEventListener("DOMContentLoaded", async () => {

    cart = await getCart();

    loadCheckout();

    document
        .getElementById("checkoutForm")
        .addEventListener("submit", placeOrder);

});

// ==========================================
// LOAD ORDER SUMMARY
// ==========================================

function loadCheckout() {

    const container = document.getElementById("checkoutItems");

    if (!container) return;

    if (cart.length === 0) {

        window.location.href = "cart.html";

        return;

    }

    container.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        container.innerHTML += `

            <div class="checkout-item">

                <span>

                    ${item.name}

                    × ${item.quantity}

                </span>

                <span>

                    ₹${(item.price * item.quantity).toLocaleString("en-IN")}

                </span>

            </div>

        `;

    });

    const tax = subtotal * 0.18;

    const total = subtotal + tax;

    document.getElementById("checkoutSubtotal").textContent =
        "₹" + subtotal.toLocaleString("en-IN");

    document.getElementById("checkoutTax").textContent =
        "₹" + tax.toLocaleString("en-IN");

    document.getElementById("checkoutTotal").textContent =
        "₹" + total.toLocaleString("en-IN");

    updateCartCount();

}

// ==========================================
// UPDATE NAVBAR CART COUNT
// ==========================================

function updateCartCount() {

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    const badge = document.getElementById("cartCount");

    if (badge) {

        badge.textContent = total;

    }

}

// ==========================================
// PLACE ORDER
// ==========================================

async function placeOrder(event) {

    event.preventDefault();

    const name =
        document.getElementById("customerName").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const address =
        document.getElementById("address").value.trim();

    if (

        name === "" ||

        email === "" ||

        phone === "" ||

        address === ""

    ) {

        showToast("Please fill all required fields.");

        return;

    }

    const order = {

    customer: name,

    email: email,

    phone: phone,

    address: address,

    items: cart,

    total: cart.reduce(

        (sum, item) => sum + (item.price * item.quantity),

        0

    )

};

const result = await placeOrderAPI(order);

if(result.success){

    cart = [];

    updateCartCount();

    const modal = document.getElementById("successModal");

    modal.style.display = "flex";

}

}

// ==========================================
// CONTINUE SHOPPING
// ==========================================

document
    .getElementById("continueShopping")
    .addEventListener("click", () => {

        window.location.href = "index.html";

});

// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `

        <i class="fa-solid fa-circle-exclamation"></i>

        ${message}

    `;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}