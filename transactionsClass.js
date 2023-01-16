class Transactions {
    constructor(balance) {
        this.balance = balance;
    }

    deposit(amount) {
        balance += amount
        return (`${amount} deposited to your account, new balance is ${this.balance}`)
    }

    withdraw(amount) {
        balance -= amount
        return (`${amount} withdrawn from your account, new balance is ${this.balance}`)
    }

    checkBalance() {
        return (`{balance is ${this.balance}}`)
    }
}