const Asset = require('./asset');

describe('Asset', () => {
  let asset;

  beforeEach(() => {
    asset = new Asset('XYZ', 200);
  });

  test('can be instantiated', () => {
    expect(asset.amount).toEqual(200);
    expect(asset.symbol).toEqual('XYZ');
  });

  test('can be added to', () => {
    asset.add(100);
    expect(asset.amount).toEqual(300);
  });

  test('can be subtracted from', () => {
    asset.subtract(100);
    expect(asset.amount).toEqual(100);
  });
})
