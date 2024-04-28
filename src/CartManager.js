import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, 'carts.json');
        this.carts = this.readCartsFromFile();
        this.nextCartId = Object.keys(this.carts).length + 1;
    }

    readCartsFromFile() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data) || {};
        } catch (err) {
            return {};  // Si no hay archivo, retorna un objeto vacío
        }
    }

    writeCartsToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
    }

    createCart() {
        const cartId = this.nextCartId++;
        this.carts[cartId] = { id: cartId, products: [] };
        this.writeCartsToFile();
        return cartId;
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.carts[cartId];
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        this.writeCartsToFile();
    }

    getProductsInCart(cartId) {
        const cart = this.carts[cartId];
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart.products;
    }
}
