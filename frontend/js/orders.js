async function loadOrders() {

    const orders = await getOrders();

    const container = document.getElementById("ordersContainer");

    if (orders.length === 0) {

        container.innerHTML = `
            <h2 style="text-align:center">
                No Orders Found
            </h2>
        `;

        return;

    }

    container.innerHTML = "";

    orders.reverse().forEach(order => {

        let items = "";

        order.items.forEach(product => {

            items += `
                <li>
                    ${product.name}
                    × ${product.quantity}
                </li>
            `;

        });

        container.innerHTML += `

        <div class="order-card">

            <h2>Order #${order.id}</h2>

            <p><b>Date:</b> ${order.date}</p>

            <p><b>Name:</b> ${order.customer}</p>

            <p><b>Email:</b> ${order.email}</p>

            <p><b>Phone:</b> ${order.phone}</p>

            <p><b>Address:</b> ${order.address}</p>

            <p><b>Total:</b> ₹${order.total.toLocaleString("en-IN")}</p>

            <h3>Items</h3>

            <ul>

                ${items}

            </ul>

        </div>

        `;

    });

}

loadOrders();