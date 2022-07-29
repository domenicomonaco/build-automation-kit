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
const clones = require('./gitclone.js');
const loops = require('./loops.js');
//LOAD ENNV
dotenv.config();
shell.clear();

//print header
visuals.header();

const { argv } = require("yargs")
  .command('update [-f filename] [--notopen]', '', (yargs) => {

    console.log(clc.magenta('Funzionalità:') + clc.bgMagenta('update'));
    console.log(clc.magenta('Repo name:') + clc.bgMagenta(yargs.argv.repo));

    clones.gitCloneWrapper(yargs.argv.repo, yargs.argv.notopen, yargs.argv.file);

  })
  .command('loop [-f filename] [--notopen]',  '', (yargs) => {
    console.log(clc.magenta('Funzionalità:') + clc.bgMagenta('delete'));
    console.log(clc.magenta('Repo name:') + clc.bgMagenta(yargs.argv.repo));
    loops.gitCloneWrapper(yargs.argv.repo, yargs.argv.notopen, yargs.argv.file);
  })
  .options({
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
