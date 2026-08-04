// ===========================================
// RedisCart - Products Page
// ===========================================

// Premium Product List
let products = [];

let filteredProducts = [];


// ===========================================
// Load Products
// ===========================================

async function loadProducts() {

    products = await getProducts();

    filteredProducts = [...products];

    displayProducts(products);

}

function displayProducts(list) {

    const grid = document.getElementById("productsGrid");

    if (!grid) return;

    if (list.length === 0) {

        grid.innerHTML = `
            <div class="no-products">

                <i class="fa-solid fa-box-open"></i>

                <h2>No Products Found</h2>

                <p>Try another search.</p>

            </div>
        `;

        return;
    }

    grid.innerHTML = "";

    list.forEach(product => {

        grid.innerHTML += `

        <div class="product-card">

    <div class="badge">
        ${product.badge}
    </div>

    <div class="product-image">

        <img src="${product.image}" alt="${product.name}">

    </div>

            <div class="product-info">

                <div class="product-category">

                    ${product.category}

                </div>

                <h2 class="product-title">

                    ${product.name}

                </h2>

                <p class="product-desc">

                    ${product.description}

                </p>

                <div class="rating">

                    ${generateStars(product.rating)}

                </div>

                <div class="product-price">

                    ₹${product.price.toLocaleString("en-IN")}

                </div>

                <button
                    class="add-cart"
                    onclick="addToCart(${product.id}, event)">

                    <i class="fa-solid fa-cart-plus"></i>

                    Add to Cart

                </button>

            </div>

        </div>

        `;

    });

}

// ===========================================
// Generate Stars
// ===========================================

function generateStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= rating)

            stars += `<i class="fa-solid fa-star"></i>`;

        else

            stars += `<i class="fa-regular fa-star"></i>`;

    }

    return stars;

}

// ===========================================
// Search Products
// ===========================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        filteredProducts = products.filter(product =>

            product.name.toLowerCase().includes(value)

        );

        displayProducts(filteredProducts);

    });

}

// ===========================================
// Category Filter
// ===========================================

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "All") {

            filteredProducts = [...products];

        }

        else {

            filteredProducts = products.filter(product =>

                product.category === category

            );

        }

        displayProducts(filteredProducts);

    });

});

// ===========================================
// Add To Cart
// ===========================================

async function addToCart(id, event) {

    let cart = await getCart();

    const product = products.find(item => item.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    await saveCart(cart);

    await updateCartBadge();

    showToast(`${product.name} added to cart`);

    const button = event.currentTarget;

    const originalHTML = button.innerHTML;

    button.innerHTML = `<i class="fa-solid fa-check"></i> Added`;

    button.style.background = "#10B981";

    button.disabled = true;

    setTimeout(() => {

        button.innerHTML = originalHTML;

        button.style.background = "";

        button.disabled = false;

    }, 1000);

}

// ===========================================
// Update Cart Badge
// ===========================================
async function updateCartBadge() {

    const cart = await getCart();

    let total = 0;

    cart.forEach(item => {

        total += item.quantity;

    });

    const top = document.getElementById("cartCount");

    const floating = document.getElementById("floatingCartCount");

    if (top) top.textContent = total;

    if (floating) floating.textContent = total;

}

// ===========================================
// Toast Notification
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

// ===========================================
// Initial Load
// ===========================================

loadProducts();

updateCartBadge();