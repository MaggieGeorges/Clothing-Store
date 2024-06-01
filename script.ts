interface Product {
    id: string;
    name: string;
    price: number;
    desc: string;
    img: string;
}

interface BasketItem {
    id: string;
    item: number;
}

class Cart {
    private labelElement: HTMLElement;
    private shoppingCartElement: HTMLElement;
    private basket: BasketItem[];
    private shopItemsData: Product[];

    constructor(labelId: string, shoppingCartId: string, shopItemsData: Product[]) {
        this.labelElement = document.getElementById(labelId) as HTMLElement;
        this.shoppingCartElement = document.getElementById(shoppingCartId) as HTMLElement;
        this.basket = JSON.parse(localStorage.getItem("data") as string) || [];
        this.shopItemsData = shopItemsData;
        this.initialize();
    }

    private initialize(): void {
        this.calculation();
        this.generateCartItems();
        this.totalAmount();
    }

    private saveBasket(): void {
        localStorage.setItem("data", JSON.stringify(this.basket));
    }

    private calculation(): void {
        const cartIcon = document.getElementById("cartAmount") as HTMLElement;
        cartIcon.innerHTML = this.basket.map(x => x.item).reduce((x, y) => x + y, 0).toString();
    }

    private generateCartItems(): void {
        if (this.basket.length !== 0) {
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
        } else {
            this.shoppingCartElement.innerHTML = ``;
            this.labelElement.innerHTML = `
                <h2>Cart is Empty</h2>
                <a href="index.html">
                    <button class="HomeBtn">Back to home</button>
                </a>
            `;
        }
    }

    public increment(id: string): void {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem) {
            this.basket.push({ id: id, item: 1 });
        } else {
            selectedItem.item += 1;
        }
        this.generateCartItems();
        this.update(id);
        this.saveBasket();
    }

    public decrement(id: string): void {
        let selectedItem = this.basket.find(x => x.id === id);
        if (!selectedItem) return;
        if (selectedItem.item === 0) return;
        selectedItem.item -= 1;
        if (selectedItem.item === 0) {
            this.basket = this.basket.filter(x => x.id !== id);
        }
        this.generateCartItems();
        this.update(id);
        this.saveBasket();
    }

    private update(id: string): void {
        let selectedItem = this.basket.find(x => x.id === id);
        if (selectedItem) {
            (document.getElementById(id) as HTMLElement).innerHTML = selectedItem.item.toString();
            this.calculation();
            this.totalAmount();
        }
    }

    public removeItem(id: string): void {
        this.basket = this.basket.filter(x => x.id !== id);
        this.generateCartItems();
        this.totalAmount();
        this.calculation();
        this.saveBasket();
    }

    public clearCart(): void {
        this.basket = [];
        this.generateCartItems();
        this.calculation();
        this.saveBasket();
    }

    private totalAmount(): void {
        if (this.basket.length !== 0) {
            let amount = this.basket.map(x => {
                let { item, id } = x;
                let search = this.shopItemsData.find(y => y.id === id);
                return search ? item * search.price : 0;
            }).reduce((x, y) => x + y, 0);
            this.labelElement.innerHTML = `
                <h2>Total Bill : $ ${amount
                }</h2>
                <button class="checkout" onclick="cart.checkout()">Checkout</button>
                <button onclick="cart.clearCart()" class="removeAll">Clear Cart</button>
                `;
                } else {
                this.labelElement.innerHTML = ``;
                }
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

        const shopItemsData: Product[] = [
            {
                "id": "xzdsxdfgh",
                "name": "Casual Shirt",
                "price": 45,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img1.webp"
            },
            {
                "id": "WETYUJ",
                "name": "Office Shirt",
                "price": 100,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img2.jpg"
            },
            {
                "id": "mzfghjk",
                "name": "T Shirt",
                "price": 25,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img3.jpg"
            },
            {
                "id": "qWERTYU",
                "name": "Mens Suit",
                "price": 300,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img4.webp"
            },
            {
                "id": "asduwygb",
                "name": "Beninos 3/4 Sleeve",
                "price": 35,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img5.jpg"
            },
            {
                "id": "suioklmn",
                "name": "Two Piece Pencil Skirt",
                "price": 47,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img6.jpg"
            },
            {
                "id": "bnmazxsqw",
                "name": "Zara Pants",
                "price": 25,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img7.jpg"
            },
            {
                "id": "ertyuihjjk",
                "name": "Women's suit official wear",
                "price": 25,
                "desc": "Lorem ipsum dolor sit amet consectetur adipisicing,",
                "img": "images/Img8.jpg"
            }
        ];
        
        const cart = new Cart('label', 'shopping-cart', shopItemsData);
        
        
        
        

