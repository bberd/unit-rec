
const RecData = require('./rec-data');
const Asset = require('./asset');

module.exports = class Portfolio {
  constructor() {
    this.assets = {};
    this.d1Pos = {};
    this.d1Trn = [];
    this.recData = new RecData();
  }

  async parseInput() {
    await this.recData.import();
    this.recData.parse();
    this.assets = this.recData.parsedPos.d0Pos;
    this.d1Pos = this.recData.parsedPos.d1Pos;
    this.d1Trn = this.recData.parsedTrn;
  }

  applyTransactionsToD0() {
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

    console.log('$^^^^$^^^$^^^$\n', this.assets);
  }

  async reconcile() {
    let reconOut = '';

    function addToResult(symbol, amtDiff) {
      if (Math.abs(amtDiff) !== 0) {
        reconOut += symbol + " " + amtDiff + "\n";
      }
    }

    for (let asset in this.assets) {
      const amtDiff = this.d1Pos[asset]
        ? this.d1Pos[asset].amount - this.assets[asset].amount
        : -this.assets[asset].amount;
      addToResult(this.assets[asset].symbol, amtDiff)
      delete this.d1Pos[asset];
    }

    for (let asset in this.d1Pos) {
      addToResult(this.d1Pos[asset].symbol, this.d1Pos[asset].amount)
    }

    await this.recData.export(reconOut);
  };
}
