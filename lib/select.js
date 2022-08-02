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

//LOAD ENNV
dotenv.config();

const git = require('./gitop.js');
