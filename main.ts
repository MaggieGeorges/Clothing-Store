import { shopItemsData } from './data.js';

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

let basket: BasketItem[] = JSON.parse(localStorage.getItem("data") || "[]"); 

 export const fetchShopItemsData = async (): Promise<Product[]> => {
    const response = await fetch('/data.json');
     const data = await response.json();
     return data.items;
 };

class Shop {
    private shopElement: HTMLElement;
    private shopItemsData: Product[];
    private basket: BasketItem[];

    constructor(shopElementId: string, shopItemsData: Product[], basket: BasketItem[]) {
        this.shopElement = document.getElementById(shopElementId) as HTMLElement;
        this.shopItemsData = shopItemsData;
        this.basket = basket;
    }

    private findBasketItem(productId: string): BasketItem | undefined {
        return this.basket.find(item => item.id === productId);
    }

    public generateShop(): void {
        const shopHTML = this.shopItemsData.map((product) => {
            const { id, name, price, desc, img } = product;
            const search = this.findBasketItem(id);
            const quantity = search ? search.item : 0;

            return `
                <div id="product-id-${id}" class="items">
                    <img width="220" src="${img}" alt="">
                    <div class="details">
                        <h3>${name}</h3>
                        <p>${desc}</p>
                        <div class="price-quantity">
                            <h2>$ ${price}</h2>
                            <div class="buttons">
                                <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
                                <div id="${id}" class="quantity">${quantity}</div>
                                <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        this.shopElement.innerHTML = shopHTML;
    }
}


const shop = new Shop('shop', shopItemsData, basket);
shop.generateShop();

const increment = (id: string): void => {
    let search = basket.find((x) => x.id === id);

    if (!search) {
        basket.push({
            id: id,
            item: 1,
        });
    } else {
        search.item += 1;
    }

    update(id);

    localStorage.setItem("data", JSON.stringify(basket));
};

const decrement = (id: string): void => {
    let search = basket.find((x) => x.id === id);

    if (!search) return;
    if (search.item === 0) return;
    search.item -= 1;

    update(id);
    basket = basket.filter((x) => x.item !== 0);

    localStorage.setItem("data", JSON.stringify(basket));
};

const update = (id: string): void => {
    const search = basket.find((x) => x.id === id);
    if (search) {
        (document.getElementById(id) as HTMLElement).innerHTML = search.item.toString();
    }
    calculation();
};

const calculation = (): void => {
    const cartIcon = document.getElementById("cartAmount") as HTMLElement;
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0).toString();
};

calculation();

(window as any).increment = increment;
(window as any).decrement = decrement;