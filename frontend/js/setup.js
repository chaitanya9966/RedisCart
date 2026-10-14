const API_URL = "https://rediscart.onrender.com";

const setupType = document.getElementById("setup-type");
const setupBudget = document.getElementById("setup-budget");
const setupProducts = document.getElementById("setup-products");
const availableCount = document.getElementById("available-count");
const analysisCount = document.getElementById("analysis-count");
const analysisBudget = document.getElementById("analysis-budget");
const analysisCost = document.getElementById("analysis-cost");
const analysisRemaining = document.getElementById("analysis-remaining");
const analyzeButton = document.getElementById("analyze-setup");
const analysisResult = document.getElementById("analysis-result");
const selectedProductsContainer = document.getElementById("selected-products");
const setupTotal = document.getElementById("setup-total");
const addSetupCartButton = document.getElementById("add-setup-cart");

let products = [];
let selectedProductIds = new Set();

const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(Number(price) || 0);

async function loadSetupProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
            throw new Error(`Products API returned ${response.status}`);
        }

        products = await response.json();

        availableCount.textContent = `${products.length} products available`;

        if (!products.length) {
            setupProducts.innerHTML = "<p>No products are available.</p>";
            return;
        }

        setupProducts.innerHTML = products.map(product => `
            <label class="setup-product-card">
                <input
                    type="checkbox"
                    value="${String(product.id).replace(/"/g, "&quot;")}"
                    data-product-id="${String(product.id).replace(/"/g, "&quot;")}"
                >
                <span class="setup-product-info">
                    <strong>${escapeHTML(product.name)}</strong>
                    <span>${formatPrice(product.price)}</span>
                </span>
            </label>
        `).join("");

        setupProducts.querySelectorAll("[data-product-id]").forEach(input => {
            input.addEventListener("change", () => {
                const id = input.dataset.productId;

                if (input.checked) {
                    selectedProductIds.add(id);
                } else {
                    selectedProductIds.delete(id);
                }

                updateSummary();
            });
        });

        updateSummary();
    } catch (error) {
        console.error("Could not load setup products:", error);
        setupProducts.innerHTML =
            "<p>Could not load products. Please refresh the page.</p>";
        availableCount.textContent = "Unable to load";
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getSelectedProducts() {
    return products.filter(product =>
        selectedProductIds.has(String(product.id))
    );
}

function updateSummary() {
    const selected = getSelectedProducts();
    const cost = selected.reduce(
        (total, product) => total + Number(product.price || 0), 0
    );
    const budget = Number(setupBudget.value) || 0;

    analysisCount.textContent = selected.length;
    analysisBudget.textContent = formatPrice(budget);
    analysisCost.textContent = formatPrice(cost);
    analysisRemaining.textContent = formatPrice(budget - cost);
    setupTotal.textContent = formatPrice(cost);

    selectedProductsContainer.innerHTML = selected.length
        ? selected.map(product => `
            <p>${escapeHTML(product.name)} — ${formatPrice(product.price)}</p>
          `).join("")
        : "<p>No products selected.</p>";
}

setupBudget.addEventListener("input", updateSummary);

analyzeButton.addEventListener("click", async () => {
    const selected = getSelectedProducts();
    const budget = Number(setupBudget.value);

    if (!selected.length) {
        alert("Please select at least one product.");
        return;
    }

    if (!Number.isFinite(budget) || budget <= 0) {
        alert("Please enter a valid budget.");
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

    try {
        const response = await fetch(`${API_URL}/setup/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productIds: selected.map(product => product.id),
                setupType: setupType.value,
                budget
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Request failed (${response.status})`);
        }

        analysisResult.innerHTML = `
            <strong>${escapeHTML(
                result.message || result.title || "Setup Analysis Complete"
            )}</strong>
            <p>${escapeHTML(
                result.analysis || result.recommendation ||
                result.description || "Your selected setup was analyzed successfully."
            )}</p>
        `;
    } catch (error) {
        console.error("Setup analysis failed:", error);
        analysisResult.innerHTML = `
            <strong>Analysis unavailable</strong>
            <p>${escapeHTML(error.message)}. Please try again.</p>
        `;
    } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "⚒ Analyze Compatibility";
    }
});

addSetupCartButton.addEventListener("click", async () => {
    const selected = getSelectedProducts();

    if (!selected.length) {
        alert("Please select products to add to your cart.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart`);
        if (!response.ok) throw new Error("Could not retrieve the cart.");

        const cartData = await response.json();
        const cart = Array.isArray(cartData)
            ? cartData
            : Array.isArray(cartData.cart) ? cartData.cart : [];

        for (const product of selected) {
            const existing = cart.find(
                item => String(item.id) === String(product.id)
            );

            if (existing) {
                existing.quantity = Number(existing.quantity || 1) + 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
        }

        const saveResponse = await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cart)
        });

        if (!saveResponse.ok) {
            throw new Error("Could not save the setup to your cart.");
        }

        alert("Selected setup added to your cart!");
        window.location.href = "./cart.html";
    } catch (error) {
        console.error("Could not add setup to cart:", error);
        alert(error.message || "Unable to add setup to cart.");
    }
});

loadSetupProducts();