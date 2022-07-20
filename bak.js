const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
const clc = require("cli-color");
require('shelljs-plugin-clear');
const open = require('open');

const visuals = require('./lib/visuals.js');
const git = require('./lib/gitop.js');

//LOAD ENNV
dotenv.config();
shell.clear();

const { argv } = require("yargs")
  .command('update [-f filename] [--notopen]', '', (yargs) => {
    console.log(yargs.argv);
    console.log(clc.magenta(
      'Hai slezionato:'
    ) + clc.bgMagenta('update'));
  }).command('clean [-f filename] [--notopen]', '', (yargs) => {
  }, function (argv) {
    console.log(clc.magenta(
      'Hai slezionato:'
    ) + clc.bgMagenta('clean'));
  }).options({
    'f': {
      alias: 'file',
      demandOption: true,
      default: 'users.csv',
      describe: 'csv of user',
      type: 'string'
    }
  }).options({
    'notopen': {
      demandOption: false,
      default: false,
      describe: 'no open browser',
      type: 'boolean'
    }
  }).options({
    'repo': {
      alias: 'r',
      demandOption: true,
      default: false,
      describe: 'name of repo, default was taken from .env',
      type: 'string'
    }
  }).demandCommand(1, clc.bgRed('You need at least one command before moving on'))
  .help('h')
  .alias('h', 'help')
  .epilogue('for more information, find the documentation at https://tecnologieperpersone.it')
  .argv;
