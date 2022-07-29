const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
const clc = require("cli-color");
require('shelljs-plugin-clear');
const open = require('open');
const path = require('path');
var stdio = require('stdio');

const visuals = require('./lib/visuals.js');

const git = require('./lib/gitop.js');

//LOAD ENNV
dotenv.config();
shell.clear();


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function gitClone(ex, filecsv) {
  const basedir = path.join(__dirname);
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;
  let list = [];
  //open to the broowser

  fs.createReadStream(filecsv)
    .pipe(csv())
    .on('data', (row) => {
      list.push(row);
      //console.log('ok');
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
      console.log(list);
    });


  //}

}

function gitCloneWrapper(
    reponame,
    notopenbrowser=true,
    filecsv) {
  (async () => {
    const response = await prompts({
      type: 'number',
      name: 'value',
      message: 'Quanti cicli vuoi fare?',
      initial: 1,
      validate: value => value == 0 ? `deve essere almeno 1` : true
    });

    if(notopenbrowser==false){
      open(process.env.BASELOCALURL.toString());
    }

    for (let i = 0; i <= parseInt(response['value']); i++) {
      gitClone(reponame, filecsv);
    }

  })();

}

module.exports = { gitCloneWrapper }
