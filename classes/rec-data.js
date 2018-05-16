const fs = require('fs');
const Asset = require('./asset');
const Transaction = require('./transaction');

module.exports = class RecData {
  constructor() {
    this.inputFilenamePath = __dirname + '/../test-data/recon.in';
    this.outputFilenamePath = __dirname + '/../test-data/recon.out';
    this.initInOutPaths();
    this.inputData = '';
    this.parsedD0Pos = {};
    this.parsedD1Trn = [];
    this.parsedD1Pos = {};
  }

  get parsedPos() {
    return { d0Pos: this.createPos(this.parsedD0Pos), d1Pos: this.createPos(this.parsedD1Pos) };
  }

  get parsedTrn() {
    return this.createTrn(this.parsedD1Trn);
  }

  initInOutPaths() {
    if (process.argv.length < 3) return;

    let inputFilenamePathArr = process.argv.find((el) => el.startsWith('in='));
    this.inputFilenamePath = inputFilenamePathArr
      ? './' + inputFilenamePathArr.slice(3, inputFilenamePathArr.length)
      : this.inputFilenamePath;

    let outputFilenamePathArr = process.argv.find((el) => el.startsWith('out='));
    this.outputFilenamePath = outputFilenamePathArr
      ? './' + outputFilenamePathArr.slice(4, outputFilenamePathArr.length)
      : this.outputFilenamePath;
  }

  async import() {
    this.inputData = await new Promise((resolve, reject) => {
      fs.readFile(this.inputFilenamePath, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      })
    });
  }

  parse() {
    [this.parsedD0Pos, this.parsedD1Trn, this.parsedD1Pos] = this.inputData
      .split(/D0-POS|D1-TRN|D1-POS/)
      .filter(el => el !== '')
      .map(el => el
        .split('\n')
        .filter(el => el !== ''));
  }

  createPos(parsedPositions) {
    const assets = {}
    parsedPositions && parsedPositions.map(pos => {
      const [symbol, amount] = pos.split(' ');
      assets[symbol] = new Asset(symbol, amount);
    });
    return assets;
  }

  createTrn(parsedTransactions) {
    return parsedTransactions && parsedTransactions.map(trn => {
      const [symbol, code, shares, value] = trn.split(' ');
      return new Transaction(symbol, code, shares, value);
    });
  }

  async export(rec) {
    if (fs.existsSync(this.outputFilenamePath)) fs.unlinkSync(this.outputFilenamePath);
    await new Promise((resolve, reject) => {
      fs.appendFile(this.outputFilenamePath, rec, 'utf8', (err) => {
        if (err) reject(err);
        else resolve();
      })
    });
  }

}
