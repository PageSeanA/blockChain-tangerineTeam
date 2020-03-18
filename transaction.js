

///represents the transactions associated with a block

class Transaction {

    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

module.exports = Transaction;

