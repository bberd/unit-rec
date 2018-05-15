module.exports = class Asset {
  constructor(_symbol, _amount) {
    this.symbol = _symbol;
    this.amount = Number(_amount);
  }

  add(newAmt) {
    this.amount += Number(newAmt);
  }

  subtract(newAmt) {
    this.amount -= Number(newAmt);
  }
}
