const Portfolio = require('./classes/portfolio');

const init = async () => {
  try {
    const port = new Portfolio();
    await port.parseInput();
    port.applyTransactionsToD0();
    await port.reconcile();
  } catch (err) {
    console.log('Error occured:\n', err)
  }
}

init();

module.exports.init = init;
