import {Product} from "@/models/product";

export class Cart {
    constructor(
        public id: number,
        public user_id: number,
        public product_id: number,
        public qty: number,
        public price: number,
        public product: Product
    ) {
    }
}