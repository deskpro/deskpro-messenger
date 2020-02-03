'use strict';

const path = require('path');
const fs = require('fs');

const lerna = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../lerna.json')));
console.log(lerna.version);
