/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const shell = require('shelljs');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const pathbuilder = require("./pathbuilder");
const path = require('path');
//LOAD ENNV
dotenv.config();

function start() {
  console.log(pathbuilder.all);
  console.log(path.resolve(__dirname));
  console.log(path.resolve(''));
  console.log(path.resolve());

}

module.exports = { start }
