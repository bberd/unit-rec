
const Input = require('./input');
const Asset = require('./asset');

module.exports = class Portfolio {
  constructor(_input) {
    this.input = _input;
  }

  parseInput(inputJSON) {
    const reconIn = new Input(this.input);
    this.assets = reconIn.parsedPos.d0Pos;
    this.d1Pos = reconIn.parsedPos.d1Pos;
    this.d1Trn = reconIn.parsedTrn;
    console.log('\nparsedD1Pos\n', this.d1Pos)
  }

  applyTransactions() {
    const handleTrnCash = trans => {
      if (trans.type === 'DEPOSIT' || trans.type === 'DIVIDEND') {
        this.assets['Cash'].add(trans.value);
        // just else here?
      } else if (trans.type === 'FEE') {
        this.assets['Cash'].subtract(trans.value);
      }
    }

    const handleTrnStock = trans => {
      if (trans.type === 'SELL') {
        this.assets['Cash'].add(trans.value);
        this.assets[trans.symbol].subtract(trans.shares);
      } else {
        this.assets['Cash'].subtract(trans.value);
        this.assets[trans.symbol].add(trans.shares);
      }
    }

    for (let trans of this.d1Trn) {
      if (!this.assets[trans.symbol]) {
        this.assets[trans.symbol] = new Asset(trans.symbol, 0);
      };
      if (trans.symbol === 'Cash' || trans.type === 'DIVIDEND') handleTrnCash(trans);
      else handleTrnStock(trans);
    }

    console.log('$^^^^$^^^$^^^$', this.assets);
  }

  reconcile() {

  };
}
