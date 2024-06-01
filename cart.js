const shopItemsData = require('./data.js').default;
class Cart {
    constructor(labelId, shoppingCartId, shopItemsData) {
        this.labelElement = document.getElementById(labelId);
        this.shoppingCartElement = document.getElementById(shoppingCartId);
        this.basket = JSON.parse(localStorage.getItem("data") || "[]");
        this.shopItemsData = shopItemsData;
        this.initialize();
    }
    initialize() {
        this.calculation();
        this.generateCartItems();
        this.totalAmount();
        return this;
    }
    saveBasket() {
        localStorage.setItem("data", JSON.stringify(this.basket));
        return this;
    }
    calculation() {
        const cartIcon = document.getElementById("cartAmount");
        cartIcon.innerHTML = this.basket.map(x => x.item).reduce((x, y) => x + y, 0).toString();
        return this;
    }
    generateCartItems() {
        if (this.basket.length !== 0 && this.shoppingCartElement) {
            this.shoppingCartElement.innerHTML = this.basket.map(x => {
                const { id, item } = x;
                const search = this.shopItemsData.find(y => y.id === id);
                if (!search)
                    return ''; // Skip items with invalid IDs
                const { img, name, price } = search;
                return `
                    <div class="cart-item">
                        <img width="100" src="${img}" alt="" />
                        <div class="details">
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${name}</p>
                                    <p class="cart-item-price">$ ${price}</p>
                                </h4>
                                <i onclick="cart.removeItem('${id}')" class="bi bi-x-lg"></i>
                            </div>
                            <div class="buttons">
                                <i onclick="cart.decrement('${id}')" class="bi bi-dash-lg"></i>
                                <div id="${id}" class="quantity">${item}</div>
                                <i onclick="cart.increment('${id}')" class="bi bi-plus-lg"></i>
                            </div>
                            <h3>$ ${item * price}</h3>
                        </div>
                    </div>
                `;
            }).join("");
        }
        else if (this.shoppingCartElement && this.labelElement) {
            this.shoppingCartElement.innerHTML = ``;
            this.labelElement.innerHTML = `
                <h2>Cart is Empty</h2>
                <a href="index.html">
                    <button class="HomeBtn">Back to home</button>
                </a>
            `;
        }
        return this;
    }
    increment(id) {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem) {
            this.basket.push({ id: id, item: 1 });
        }
        else {
            selectedItem.item += 1;
        }
        return this.saveBasket().update(id);
    }
    decrement(id) {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem)
            return this;
        if (selectedItem.item === 0)
            return this;
        selectedItem.item -= 1;
        if (selectedItem.item === 0) {
            this.basket = this.basket.filter(x => x.id !== id);
        }
        return this.saveBasket().update(id);
    }
    update(id) {
        let selectedItem = this.basket.find(x => x.id === id);
        if (selectedItem) {
            document.getElementById(id).innerHTML = selectedItem.item.toString();
            return this.calculation().totalAmount();
        }
        return this;
    }
    removeItem(id) {
        this.basket = this.basket.filter(x => x.id !== id);
        return this.saveBasket().generateCartItems().totalAmount();
    }
    clearCart() {
        this.basket = [];
        return this.saveBasket().generateCartItems().totalAmount();
    }
    totalAmount() {
        if (this.basket.length !== 0 && this.labelElement) {
            let amount = this.basket.map(x => {
                let { item, id } = x;
                let search = this.shopItemsData.find(y => y.id === id);
                return search ? item * search.price : 0;
            }).reduce((x, y) => x + y, 0);
            this.labelElement.innerHTML = `
                <h2>Total Bill : $ ${amount}</h2>
                <button class="checkout" onclick="cart.checkout()">Checkout</button>
                <button onclick="cart.clearCart()" class="removeAll">Clear Cart</button>
            `;
        }
        else if (this.labelElement) {
            this.labelElement.innerHTML = ``;
        }
        return this;
    }
    checkout() {
        const userDetails = this.getUserDetails();
        if (!userDetails) {
            alert('User not logged in');
            return;
        }
        if (this.basket.length === 0) {
            alert('Cart is empty');
            return;
        }
        let amount = this.basket.map(x => {
            let { item, id } = x;
            let search = this.shopItemsData.find(y => y.id === id);
            return search ? item * search.price : 0;
        }).reduce((x, y) => x + y, 0);
        const order = {
            userId: userDetails.id,
            username: userDetails.username,
            total: amount,
            items: this.basket
        };
        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
            .then(response => response.json())
            .then(data => {
            alert('Order placed successfully');
            this.clearCart();
            window.location.href = 'index.html';
        })
            .catch(error => {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again later.');
        });
    }
    getUserDetails() {
        return JSON.parse(localStorage.getItem('userDetails'));
    }
}
const cart = new Cart('label', 'shopping-cart', shopItemsData);
export default cart;
