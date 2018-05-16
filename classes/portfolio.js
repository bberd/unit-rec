const RecData = require('./rec-data');
const Asset = require('./asset');

module.exports = class Portfolio {
  constructor() {
    this.d0Pos = {};
    this.d1Pos = {};
    this.d1Trn = [];
    this.recData = new RecData();
    this.recOutData = '';
  }

  async parseInput() {
    await this.recData.import();
    this.recData.parse();
    this.d0Pos = this.recData.parsedPos.d0Pos;
    this.d1Pos = this.recData.parsedPos.d1Pos;
    this.d1Trn = this.recData.parsedTrn;
  }

  applyTransactionsToD0() {
    const handleTrnCash = trans => {
      if (trans.type === 'DEPOSIT' || trans.type === 'DIVIDEND') {
        this.d0Pos['Cash'].add(trans.value);
      } else if (trans.type === 'FEE') {
        this.d0Pos['Cash'].subtract(trans.value);
      }
    }

    const handleTrnStock = trans => {
      if (trans.type === 'SELL') {
        this.d0Pos['Cash'].add(trans.value);
        this.d0Pos[trans.symbol].subtract(trans.shares);
      } else {
        this.d0Pos['Cash'].subtract(trans.value);
        this.d0Pos[trans.symbol].add(trans.shares);
      }
    }

    if (this.d1Trn && this.d1Trn.length) {
      for (let trans of this.d1Trn) {
        if (!this.d0Pos[trans.symbol]) {
          this.d0Pos[trans.symbol] = new Asset(trans.symbol, 0);
        };
        if (trans.symbol === 'Cash' || trans.type === 'DIVIDEND') handleTrnCash(trans);
        else handleTrnStock(trans);
      }
    }
  }

  async reconcile() {
    const addToResult = (symbol, amtDiff) => {
      if (Math.abs(amtDiff) !== 0) {
        if (symbol === 'Cash') {
          this.recOutData = symbol + " " + amtDiff + "\n" + this.recOutData
        } else this.recOutData += symbol + " " + amtDiff + "\n";
      }
    }

    for (let asset in this.d0Pos) {
      const amtDiff = this.d1Pos[asset]
        ? this.d1Pos[asset].amount - this.d0Pos[asset].amount
        : -this.d0Pos[asset].amount;
      addToResult(this.d0Pos[asset].symbol, amtDiff)
      delete this.d1Pos[asset];
    }

    for (let asset in this.d1Pos) {
      addToResult(this.d1Pos[asset].symbol, this.d1Pos[asset].amount)
    }

    await this.recData.export(this.recOutData);
  };
}
