const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
var clc = require("cli-color");
require('shelljs-plugin-clear');
const visuals = require('./lib/visuals.js');
//LOAD ENNV
dotenv.config();
shell.clear();

function gitClone(ex) {
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;
  visuals.header();

  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (row) => {

      console.log(
        clc.red(row['nome']),
        clc.green(row['cognome']),
        clc.yellow('@' + row['gitusername']));

      if (fs.existsSync(basefolder) == false) {
        shell.mkdir('-p', basefolder);
      }
      shell.cd(basefolder);

      if (fs.existsSync(row['gitusername']) == false) {
        shell.mkdir('-p', row['gitusername']);
      }

      shell.cd(row['gitusername']);

      if (fs.existsSync(ex)) {
        shell.rm('-rf', ex);
        console.log(clc.bgRedBright('DELETED: ' + ex));
      } else {
        console.log(clc.bgMagenta('NOT EXIST: ' + ex));
      }

      shell.cd('../..');

    })
    .on('end', () => {
      console.log(clc.bgGreenBright('CSV file successfully processed'));
    });
}

gitClone(process.env.REPONAME);

