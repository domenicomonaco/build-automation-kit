/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
const clc = require("cli-color");
require('shelljs-plugin-clear');
const open = require('open');
const path = require('path');
const visuals = require('./visuals.js');
const pbuilds = require('./pathbuilder.js');

const axios = require('axios').default;

const git = require('./gitop.js');

//LOAD ENNV
dotenv.config();
shell.clear();

function loopIT(row, ex, operation) {

  //const basedir = path.resolve('');
  const baseURL = process.env.BASEGITURL;
  //const basefolder = basedir + "\\" + process.env.BASEFOLDER;

  // COMMENTO di test

  visuals.header();

  console.log(
    clc.red(row['nome']),
    clc.green(row['cognome']),
    clc.yellow('@' + row['gitusername']));

  if (fs.existsSync(basefolder) == false) {
    shell.mkdir('-p', basefolder);
  }
  shell.cd(basefolder);
  console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERR: ' + basefolder));

  if (fs.existsSync(row['gitusername']) == false) {
    shell.mkdir('-p', row['gitusername']);
  }
  shell.cd(row['gitusername']);
  console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERR: ' + row['gitusername']));

  console.log(clc.bgCyanBright('[>] ' + ex));

  switch (operation) {
    case 'update':
      console.log(clc.bgWhite('[*][ UPDATING... ]'));
      if (fs.existsSync(ex)) {
        console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERR: ' + ex));
        shell.cd(ex);
        (async () => {
          git.git_reset_and_pull();
          console.log(clc.bgGreenBright('PULLED: ' + ex));
        })();

      } else {
        shell.ls('');

        console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + ex));
        shell.exec(baseURL.toString() + row['gitusername'] + '/' + ex + '.git');
      }

      shell.cd(basedir);

      break;
    case 'reinit':
      console.log(clc.bgWhite('[*][ REINITIALIZING... ]'));

      if (fs.existsSync(ex)) {
        console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERR: ' + ex));
        console.log(clc.bgYellowBright('[X] DELETED FOLDERR: ' + ex));

        shell.rm('-rf', ex);

        console.log(clc.bgGreenBright('[✔] CLONING: ' + ex));
        shell.exec(baseURL.toString() + row['gitusername'] + '/' + ex + '.git');

        console.log(clc.bgGreenBright('PULLED: ' + ex));

      } else {
        console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + ex));
        shell.exec(baseURL.toString() + row['gitusername'] + '/' + ex + '.git');
      }

      shell.cd(basedir);

      break;
  }


}

function loopCSV(ex, filecsv, operation) {

  const basedir = path.resolve('');
  const baseURL = process.env.BASEGITURL;
  const basefolder = basedir + "\\" + process.env.BASEFOLDER;

  let list = [];

  fs.createReadStream(filecsv)
    .pipe(csv())
    .on('data', (row) => {
      list.push(row);
    })
    .on('end', () => {
      list.forEach(function (row) {
        loopIT(row, ex, operation);
      });
    });
}

function start(
  reponame,
  filecsv, operation) {
  (async () => {
    const response = await prompts({
      type: 'number',
      name: 'value',
      message: 'Quanti cicli vuoi fare?',
      initial: 1,
      validate: value => value == 0 ? `deve essere almeno 1` : true
    });

    open(process.env.BASELOCALURL.toString());

    for (let i = 0; i <= parseInt(response['value']); i++) {
      loopCSV(reponame, filecsv, operation);
    }
  })();

}

module.exports = { start }
