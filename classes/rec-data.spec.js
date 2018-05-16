
const fs = require('fs');
const RecData = require('./rec-data');
const outPath = __dirname + '/../test-data/recon.out';

describe('RecData', () => {
  let data;

  beforeEach(() => {
    data = new RecData();
  });

  afterAll(() => {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  });

  test('can be instantiated', () => {
    expect(data).toBeInstanceOf(RecData);
  });

  test('has input file in valid input path', () => {
    const fileExists = fs.existsSync(data.inputFilenamePath);
    expect(fileExists).toBeTruthy;
  });

  test('can import input file', async () => {
    await data.import();
    expect(data.inputData).toContain('D0-POS');
    expect(data.inputData).toContain('D1-TRN');
    expect(data.inputData).toContain('MSFT 10');
  });

  test('can parse positions and transactions', async () => {
    data.inputFilenamePath = __dirname + '/../test-data/recon.in';
    await data.import();
    data.parse();
    expect(data.parsedD0Pos).toContain('SP500 175.75');
    expect(data.parsedD1Trn).toContain('Cash DEPOSIT 0 1000');
    expect(data.parsedD1Pos).toContain('Cash 20000');
  });

  test('can return parsed positions', async () => {
    data.inputFilenamePath = __dirname + '/../test-data/recon.in';
    await data.import();
    data.parse();
    const parsedPos = data.parsedPos;
    expect(parsedPos.d1Pos.SP500.symbol).toBe("SP500");
    expect(parsedPos.d1Pos.SP500.amount).toBe(175.75);
    expect(parsedPos.d0Pos.SP500.symbol).toBe("SP500");
    expect(parsedPos.d0Pos.SP500.amount).toBe(175.75);
  });

  test('can return parsed transactions', async () => {
    data.inputFilenamePath = __dirname + '/../test-data/recon.in';
    await data.import();
    data.parse();
    const parsedTrans = data.parsedTrn;
    expect(parsedTrans[2].value).toBe("1000");
  });

  test('can export rec file', async () => {
    data.outputFilenamePath = outPath;
    await data.export('TEST\nXYZ 100\nABC -80');
    data.inputFilenamePath = outPath;
    await data.import();
    expect(data.inputData).toBe('TEST\nXYZ 100\nABC -80');
  });
})
