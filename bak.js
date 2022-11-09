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

const visuals = require('./lib/visuals.js');

const loops = require('./lib/loops.js');
const select = require('./lib/select.js');

//LOAD ENNV
dotenv.config();
shell.clear();

//print header
visuals.header();

const { argv } = require("yargs")
  .command('loop', 'looping on', (yargs) => {
    yargs.options({
      m: {
        alias: 'mode',
        demandOption: true,
        describe: 'mode',
        type: 'string'
      }
    });

    if (yargs.argv.mode == "reinit") {
      console.log(clc.magenta('Feature:') + clc.bgMagenta('LOOP REINITIALIZE'));
      console.log(clc.magenta('Repo name:') + clc.bgMagenta(yargs.argv.repo));
      loops.start(yargs.argv.repo, yargs.argv.file, 'reinit');
    } else if (yargs.argv.mode == "update") {
      console.log(clc.magenta('Feature:') + clc.bgMagenta('LOOP UPDATE'));
      console.log(clc.magenta('Repo name:') + clc.bgMagenta(yargs.argv.repo));
      loops.start(yargs.argv.repo, yargs.argv.file, 'update');
    }
  })
  .command('select', 'Select a single user from the csv file', (yargs) => {
    select.start(yargs.argv.repo, yargs.argv.file);
  })
  .options({
    'f': {
      alias: 'file',
      demandOption: true,
      default: process.env.USERLISTFILE,
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
      default: process.env.REPONAME,
      describe: 'name of repo, default was taken from .env',
      type: 'string'
    }
  }).demandCommand(1, clc.bgRed('You need at least one command before moving on'))
  .help('h')
  .alias('h', 'help')
  .epilogue(
    'for more information, find the documentation at https://tecnologieperpersone.it')
  .argv;
