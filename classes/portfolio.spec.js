const Portfolio = require('./portfolio');
const fs = require('fs');
const outPath = __dirname + '/../test-data/recon.out';

describe('Portfolio', () => {
  let port;

  beforeEach(() => {
    port = new Portfolio();
  });

  afterAll(() => {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });

  test('can be instantiated', () => {
    expect(port).toBeInstanceOf(Portfolio);
  });

  test('can parse test data', async() => {
    await port.parseInput();
    expect(port.d0Pos.AAPL.amount).toBe(100)
    expect(port.d1Trn).toHaveLength(6);
    expect(port.d1Pos.Cash.amount).toBe(20000);
  });

  test('can apply new transactions to D0 positions', async () => {
    await port.parseInput();
    port.applyTransactionsToD0();
    expect(port.d0Pos.AAPL.amount).toBe(0);
    expect(port.d0Pos.Cash.amount).toBe(12000);
  });

  test('can reconcile D1 position', async () => {
    await port.parseInput();
    port.applyTransactionsToD0();
    await port.reconcile();
    expect(port.recOutData).toBe('Cash 8000\nGOOG 10\nTD -100\nMSFT 10\n');
  });
})
