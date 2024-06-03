const shopItemsData = require('./data.js').default;

interface Product {
    id: string;
    name: string;
    price: number;
    img: string;
}

interface BasketItem {
    id: string;
    item: number;
}

class Cart {
    private labelElement: HTMLElement | null;
    private shoppingCartElement: HTMLElement | null;
    private basket: BasketItem[];
    private shopItemsData: Product[];

    constructor(labelId: string, shoppingCartId: string, shopItemsData: Product[]) {
        this.labelElement = document.getElementById(labelId);
        this.shoppingCartElement = document.getElementById(shoppingCartId);
        this.basket = JSON.parse(localStorage.getItem("data") || "[]");
        this.shopItemsData = shopItemsData;
        this.initialize();
    }

    private initialize(): Cart {
        this.calculation();
        this.generateCartItems();
        this.totalAmount();
        this.attachEventListeners();
        return this;
    }

    private attachEventListeners(): void {
        const clearCartButton = document.querySelector('.removeAll') as HTMLElement;
        const checkoutButton = document.querySelector('.checkout') as HTMLElement;

        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => this.clearCart());
        }

        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.checkout());
        }
    }

    private saveBasket(): Cart {
        localStorage.setItem("data", JSON.stringify(this.basket));
        return this;
    }

    private calculation(): Cart {
        const cartIcon = document.getElementById("cartAmount") as HTMLElement;
        cartIcon.innerHTML = this.basket.map(x => x.item).reduce((x, y) => x + y, 0).toString();
        return this;
    }

    private generateCartItems(): Cart {
        if (this.basket.length !== 0 && this.shoppingCartElement) {
            this.shoppingCartElement.innerHTML = this.basket.map(x => {
                const { id, item } = x;
                const search = this.shopItemsData.find(y => y.id === id);
                if (!search) return ''; // Skip items with invalid IDs
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
                                <i class="bi bi-x-lg" data-id="${id}" data-action="remove"></i>
                            </div>
                            <div class="buttons">
                                <i class="bi bi-dash-lg" data-id="${id}" data-action="decrement"></i>
                                <div id="${id}" class="quantity">${item}</div>
                                <i class="bi bi-plus-lg" data-id="${id}" data-action="increment"></i>
                            </div>
                            <h3>$ ${item * price}</h3>
                        </div>
                    </div>
                `;
            }).join("");
    
            // Attach event listeners
            this.shoppingCartElement.querySelectorAll('[data-action]').forEach(element => {
                element.addEventListener('click', (event: Event) => {
                    const target = event.target as HTMLElement;
                    const id = target.getAttribute('data-id');
                    const action = target.getAttribute('data-action');
                    if (id && action) {
                        switch (action) {
                            case 'remove':
                                this.removeItem(id);
                                break;
                            case 'decrement':
                                this.decrement(id);
                                break;
                            case 'increment':
                                this.increment(id);
                                break;
                        }
                    }
                });
            });
        } else if (this.shoppingCartElement && this.labelElement) {
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

    public increment(id: string): Cart {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem) {
            this.basket.push({ id: id, item: 1 });
        } else {
            selectedItem.item += 1;
        }
        return this.saveBasket().update(id);
    }

    public decrement(id: string): Cart {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem) return this;
        if (selectedItem.item === 0) return this;
        selectedItem.item -= 1;
        if (selectedItem.item === 0) {
            this.basket = this.basket.filter(x => x.id !== id);
        }
        return this.saveBasket().update(id);
    }

    private update(id: string): Cart {
        let selectedItem = this.basket.find(x => x.id === id);
        if (selectedItem) {
            (document.getElementById(id) as HTMLElement).innerHTML = selectedItem.item.toString();
            return this.calculation().totalAmount();
        }
        return this;
    }

    public removeItem(id: string): Cart {
        this.basket = this.basket.filter(x => x.id !== id);
        return this.saveBasket().generateCartItems().totalAmount();
    }

    public clearCart(): Cart {
        this.basket = [];
        return this.saveBasket().generateCartItems().calculation().totalAmount();
    }

    private totalAmount(): Cart {
        if (this.basket.length !== 0 && this.labelElement) {
            let amount = this.basket.map(x => {
                let { item, id } = x;
                let search = this.shopItemsData.find(y => y.id === id);
                return search ? item * search.price : 0;
            }).reduce((x, y) => x + y, 0);
            this.labelElement.innerHTML = `
                <h2>Total Bill : $ ${amount}</h2>
                <button class="checkout">Checkout</button>
                <button class="removeAll">Clear Cart</button>
            `;
        } else if (this.labelElement) {
            this.labelElement.innerHTML = ``;
        }
        return this;
    }

    public checkout(): void {
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

    private getUserDetails(): { id: string, username: string } | null {
        return JSON.parse(localStorage.getItem('userDetails') as string);
    }
}

const cart = new Cart('label', 'shopping-cart', shopItemsData);

export default cart;
