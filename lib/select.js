const shell = require('shelljs');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
const open = require('open');
const visuals = require('./visuals.js');
var clc = require("cli-color");
require('shelljs-plugin-clear');
const path = require('path');


const git = require('./gitop.js');

//LOAD ENNV
dotenv.config();

function start(
  reponame,
  notopenbrowser = true,
  filecsv,
  operation) {
  console.log('SELECT');
  const basedir = path.resolve('');
  const baseURL = process.env.BASEGITURL;
  const basefolder = basedir+"\\"+process.env.BASEFOLDER;

  let list = [];

  visuals.header();

  fs.createReadStream(filecsv)
    .pipe(csv())
    .on('data', (row) => {
      list.push({
        title: clc.bgCyanBright(row['cognome'] + ' ' + row['nome'] + ' ') + clc.bgMagenta('@' + row['gitusername']),
        value: row['gitusername']
      });
    })
    .on('end', () => {
      (async () => {
        let selecteduser = await prompts([
          {
            type: 'autocomplete',
            name: 'value',
            message: 'Pick a USER',
            choices: list,
            initial: 0
          }
        ]);


        let gitOP = await prompts([
          {
            type: 'autocomplete',
            name: 'value',
            message: 'Pick a GIT Operation',
            choices: [
              { title: 'Update from remote',  value: 'soft_update' },
              { title: 'Discard and Update',  value: 'hard_update' },
              { title: 'Delete and Clone',    value: 'reinitialize' },
            ],
            initial: 0
          }
        ]);

        console.log(gitOP['value']);

        let appOPP = await prompts([
          {
            type: 'autocomplete',
            name: 'value',
            message: 'Pick a APP Operation',
            choices: [
              { title: 'skip this', value: '' },
              { title: 'Laravel + Node', value: '' },
              { title: 'Only Node', value: '' },
              { title: 'Simple HTML/JS', value: '' },

            ],
            initial: 0
          }
        ]);

        let devOP = await prompts([
          {
            type: 'autocomplete',
            name: 'value',
            message: 'Pick a DEV Operation',
            choices: [
              { title: 'skip this', value: '' },
              { title: 'Open Code', value: '' },
              { title: 'Open Browser', value: '' },
              { title: 'Broser and Code', value: '' },

            ],
            initial: 0
          }
        ]);


      })();
    });

}

module.exports = { start }
