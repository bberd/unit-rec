// const Stock = require('./stock');
// const Cash = require('./cash');
const Asset = require('./asset');
const Transaction = require('./transaction');

module.exports = class Input {
  constructor(_input) {
    this.d0Pos = _input['D0-POS'];
    this.d1Trn = _input['D1-TRN'];
    this.d1Pos = _input['D1-POS'];
    this.parsedD0Pos = this.parsePos(this.d0Pos);
    this.parsedD1Trn = this.parseTrn(this.d1Trn);
    this.parsedD1Pos = this.parsePos(this.d1Pos);
    //this.localPos = [];
  }

  get parsedPos() {
    return { d0Pos: this.parsedD0Pos, d1Pos: this.parsedD1Pos }
  }

  get parsedTrn() {
    return this.parsedD1Trn;
  }

  // createCashOrStock(symbol, amount) {
  //   if (symbol === 'Cash') return new Cash(amount);
  //   else return new Stock(symbol, amount);
  // }

  parsePos(positions) {
    const assets = {}
    positions.map(pos => {
      const [symbol, amount] = pos.split(' ');
      assets[symbol] = new Asset(symbol, amount);
    });
    return assets;
  }

  parseTrn(transactions) {
    return transactions.map(trn => {
      const [symbol, code, shares, value] = trn.split(' ');
      return new Transaction(symbol, code, shares, value);
    });
  }

}
