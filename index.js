const reconIn = require('./test-data/recon.in.json');
const Portfolio = require('./classes/portfolio');

console.log('\nreconIn\n', reconIn);
console.log('\nReconiliation\n', Portfolio);
const rec = new Portfolio(reconIn);
rec.parseInput();
rec.applyTransactions();
//rec.reconcile();

