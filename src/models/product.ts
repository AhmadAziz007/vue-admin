export class Product {
    constructor(
        public id: number,
        public barcode: string,
        public title: string,
        public description: string,
        public stock: number,
        public price: number,
        public sell_price: number
    ) {
    }
}