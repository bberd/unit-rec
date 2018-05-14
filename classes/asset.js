module.exports = class Asset {
  constructor(_symbol, _amount) {
    this.symbol = _symbol;
    this.amount = Number(_amount);
  }

  // get symb() {
  //   return this.symb;
  // }

  // // get amount() {
  // //   return this.amount;
  // // }

  // necessary to not get TypeError
  // set symb(sym) {
  //   this._symb = sym;
  // }

  add(newAmt) {
    this.amount += Number(newAmt);
  }

  subtract(newAmt) {
    this.amount -= Number(newAmt);
  }
}
