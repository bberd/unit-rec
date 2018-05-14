module.exports = class Transaction {
  constructor(_symbol, _type, _shares, _value) {
    this.symbol = _symbol,
    this.type = _type,
    this.shares = _shares,
    this.value = _value
  }
}
