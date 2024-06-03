var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { shopItemsData } from './data.js';
let basket = JSON.parse(localStorage.getItem("data") || "[]");
export const fetchShopItemsData = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/data.json');
    const data = yield response.json();
    return data.items;
});
class Shop {
    constructor(shopElementId, shopItemsData, basket) {
        this.shopElement = document.getElementById(shopElementId);
        this.shopItemsData = shopItemsData;
        this.basket = basket;
    }
    findBasketItem(productId) {
        return this.basket.find(item => item.id === productId);
    }
    generateShop() {
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
const increment = (id) => {
    let search = basket.find((x) => x.id === id);
    if (!search) {
        basket.push({
            id: id,
            item: 1,
        });
    }
    else {
        search.item += 1;
    }
    update(id);
    localStorage.setItem("data", JSON.stringify(basket));
};
const decrement = (id) => {
    let search = basket.find((x) => x.id === id);
    if (!search)
        return;
    if (search.item === 0)
        return;
    search.item -= 1;
    update(id);
    basket = basket.filter((x) => x.item !== 0);
    localStorage.setItem("data", JSON.stringify(basket));
};
const update = (id) => {
    const search = basket.find((x) => x.id === id);
    if (search) {
        document.getElementById(id).innerHTML = search.item.toString();
    }
    calculation();
};
const calculation = () => {
    const cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0).toString();
};
calculation();
window.increment = increment;
window.decrement = decrement;
