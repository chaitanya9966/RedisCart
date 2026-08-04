// ===========================================
// RedisCart - Main JavaScript
// ===========================================

// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();
    navbarEffect();
    revealAnimation();

});

// ===========================================
// Navbar Scroll Effect
// ===========================================

function navbarEffect() {

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.12)";
            header.style.background = "rgba(255,255,255,0.95)";

        } else {

            header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.05)";
            header.style.background = "rgba(255,255,255,0.75)";

        }

    });

}

// ===========================================
// Cart Counter
// ===========================================

function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cartCount.textContent = cart.length;

}

// ===========================================
// Reveal Animation
// ===========================================

function revealAnimation() {

    const elements = document.querySelectorAll(

        ".feature-card, .category-card, .hero-content, .hero-image"

    );

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0px)";

            }

        });

    }, {
        threshold: 0.2
    });

    elements.forEach(element => {

        element.style.opacity = "0";
        element.style.transform = "translateY(40px)";
        element.style.transition = "all 0.8s ease";

        observer.observe(element);

    });

}

// ===========================================
// Smooth Button Hover Effect
// ===========================================

const buttons = document.querySelectorAll(".btn");

buttons.forEach(button => {

    button.addEventListener("mouseenter", () => {

        button.style.transform = "translateY(-5px) scale(1.03)";

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform = "translateY(0px) scale(1)";

    });

});

// ===========================================
// Temporary Demo Products
// (Will be replaced with Redis backend later)
// ===========================================

if (!localStorage.getItem("cart")) {

    localStorage.setItem("cart", JSON.stringify([]));

}