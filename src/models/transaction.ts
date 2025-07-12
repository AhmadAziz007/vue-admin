export class Transaction {
    constructor(
        public id: number,
        public user_id: number,
        public customer_id: number,
        public invoice: string,
        public cash: number,
        public change: number,
        public discount: number,
        public grand_total: number,
    ) {
    }
}

export class TransactionDetail {
    constructor(
        public id: number,
        public transaction_id: number,
        public product_id: number,
        public qty: number,
        public price: number
    ) {
    }
}