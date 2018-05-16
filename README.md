###### **Language**: JavaScript/Node

###### **Getting Started**:
- in the terminal, navigate to the /unit-rec folder and type `npm i` (installs jest for testing)
- while in /unit-rec:
  - to start with default test file and output location in /unit-rec/test-data: `npm start`
  - to start with custom input and/or output file location:
    `npm start in=../customInput.in out=../output/customOut.out`
    where the paths are in relation to the /unit-rec directory
  - to test: `npm test`

###### **Additional Notes**:
Since there doesn't appear to be a pattern in the way recon.out rows are ordered:
- recon.out will always have Cash as the first row
- all other positions will follow in the order determined by the app

