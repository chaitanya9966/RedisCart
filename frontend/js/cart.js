// ===========================================
// RedisCart - Cart Page
// ===========================================

let cart = [];

// ===========================================
// INITIAL LOAD
// ===========================================

document.addEventListener("DOMContentLoaded", async () => {

    cart = await getCart();

    loadCart();

});
// ===========================================
// LOAD CART
// ===========================================

function loadCart() {

    const cartContainer = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartSection = document.querySelector(".cart-container");

    if (cart.length === 0) {

        cartSection.style.display = "none";
        emptyCart.style.display = "block";

        updateSummary();

        return;

    }

    cartSection.style.display = "grid";
    emptyCart.style.display = "none";

    cartContainer.innerHTML = "";

    cart.forEach(item => {

        cartContainer.innerHTML += `

        <div class="cart-item">

            <div class="cart-image">

                <img src="${item.image}" alt="${item.name}">

            </div>

            <div class="cart-details">

                <h3>${item.name}</h3>

                <p>${item.description}</p>

                <div class="price">

                    ₹${item.price.toLocaleString("en-IN")}

                </div>

                <div class="quantity-box">

                    <button
                        class="qty-btn"
                        onclick="decreaseQuantity(${item.id})">

                        -

                    </button>

                    <div class="quantity">

                        ${item.quantity}

                    </div>

                    <button
                        class="qty-btn"
                        onclick="increaseQuantity(${item.id})">

                        +

                    </button>

                </div>

            </div>

            <div>

                <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})">

                    <i class="fa-solid fa-trash"></i>

                    Remove

                </button>

            </div>

        </div>

        `;

    });

    updateSummary();

}

// ===========================================
// INCREASE
// ===========================================

function increaseQuantity(id) {

    cart = cart.map(item => {

        if (item.id === id) {

            item.quantity++;

        }

        return item;

    });

    updateCart();

}

// ===========================================
// DECREASE
// ===========================================

function decreaseQuantity(id) {

    cart = cart.map(item => {

        if (item.id === id && item.quantity > 1) {

            item.quantity--;

        }

        return item;

    });

    updateCart();

}

// ===========================================
// REMOVE ITEM
// ===========================================

async function removeItem(id) {

    const removed = cart.find(item => item.id === id);

    cart = cart.filter(item => item.id !== id);

    await saveCart(cart);

    showToast(`${removed.name} removed`);

    loadCart();

}

// ===========================================
// SAVE CART
// ===========================================

async function updateCart() {

    await saveCart(cart);

    loadCart();

}

// ===========================================
// UPDATE SUMMARY
// ===========================================

function updateSummary() {

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach(item => {

        totalItems += item.quantity;

        subtotal += item.price * item.quantity;

    });

    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    document.getElementById("summaryItems").textContent = totalItems;

    document.getElementById("subtotal").textContent =
        "₹" + subtotal.toLocaleString("en-IN");

    document.getElementById("tax").textContent =
        "₹" + tax.toLocaleString("en-IN");

    document.getElementById("grandTotal").textContent =
        "₹" + grandTotal.toLocaleString("en-IN");

    updateCartBadge();

}

// ===========================================
// UPDATE CART BADGE
// ===========================================

function updateCartBadge() {

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    const badge = document.getElementById("cartCount");

    if (badge) {

        badge.textContent = total;

    }

}

// ===========================================
// CHECKOUT
// ===========================================

function goToCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }

    window.location.href = "checkout.html";

}

// ===========================================
// TOAST MESSAGE
// ===========================================

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

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