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
const { process } = require('process');
const {argv} = require('./lib/args.js');


console.log(argv);
