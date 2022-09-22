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
const prompts = require('prompts');
const open = require('open');
const visuals = require('./visuals.js');
var clc = require("cli-color");
require('shelljs-plugin-clear');
const path = require('path');
const axios = require('axios');
const git = require('./gitop.js');

let repo_info = {};
repo_info['username'] = "";//response.username;
repo_info['baseURL'] = 'https://github.com/';
//repo_info['api_url_user'] = 'https://api.github.com/users/' + repo_info['username'];
//repo_info['api_url_user_repos'] = 'https://api.github.com/users/' + repo_info['username'] + '/repos';


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
  const basefolder = basedir + "\\" + process.env.BASEFOLDER;

  let list = [];

  fs.createReadStream(filecsv)
    .pipe(csv())
    .on('data', (row) => {
      list.push({
        title: row['cognome'] + ' ' + row['nome'] + ' @' + row['gitusername'],
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

        ///////////////////////////////////////////////////////////////////////////////////
        console.log('LINK_________________________');
        console.log(baseURL.toString() + selecteduser['value'] + '/' + reponame + '.git');
        console.log('https://github.com/' + selecteduser['value'] + '/' + reponame);
        console.log('https://github.com/' + selecteduser['value']);
        console.log('_____________________________');
        ///////////////////////////////////////////////////////////////////////////////////

        let gitOP = await prompts([
          {
            type: 'autocomplete',
            name: 'value',
            message: 'Pick a GIT Operation',
            choices: [
              { title: 'Update from remote', value: 'soft_update' },
              { title: 'Discard and Update', value: 'hard_update' },
              { title: 'Delete and Clone', value: 'hard_init' },
              { title: 'Exit', value: 'exit' },
            ],
            initial: 0
          }
        ]);

        if (gitOP['value'] == 'exit') {
          process.exit(1);
        }

        if (gitOP['value'] == 'soft_update') {
          console.log(clc.bgWhite('[*][ UPDATING... ]'));
          if (fs.existsSync(basefolder)) {
            shell.cd(basefolder);

            if (!fs.existsSync(selecteduser['value'])) {
              shell.mkdir('-p', selecteduser['value']);
            }
            shell.cd(selecteduser['value']);
            if (fs.existsSync(reponame)) {
              shell.cd(reponame);
              console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDER: ' + reponame));
              (async () => {
                git.git_soft_pull();
                console.log(clc.bgGreenBright('PULLED: ' + reponame));
              })();
            } else {
              shell.ls('.');
              console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + reponame));
              shell.exec(baseURL.toString() + selecteduser['value'] + '/' + reponame + '.git');
            }
          }
          shell.cd(basedir);
        }

        if (gitOP['value'] == 'hard_init') {
          console.log(clc.bgWhite('[*][ Deleting and re-Clone... ]'));
          if (fs.existsSync(basefolder)) {
            shell.cd(basefolder);
            if (!fs.existsSync(selecteduser['value'])) {
              shell.mkdir('-p', selecteduser['value']);
            }
            shell.cd(selecteduser['value']);
            if (fs.existsSync(reponame)) {
              console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDER: ' + reponame));
              git.git_rm_and_clone(reponame, baseURL.toString() + selecteduser['value'] + '/' + reponame);
            } else {
              shell.ls('.');
              console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + reponame));
              shell.exec(baseURL.toString() + selecteduser['value'] + '/' + reponame + '.git');
            }
          }
          shell.cd(basedir);
        }

        if (gitOP['value'] == 'hard_update') {
          console.log(clc.bgWhite('[*][ UPDATING... ]'));
          if (fs.existsSync(basefolder)) {
            shell.cd(basefolder);
            if (!fs.existsSync(selecteduser['value'])) {
              shell.mkdir('-p', selecteduser['value']);
            }
            shell.cd(selecteduser['value']);
            if (fs.existsSync(reponame)) {
              shell.cd(reponame);
              console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDER: ' + reponame));

              (async () => {
                git.git_reset_and_pull();
                console.log(clc.bgGreenBright('PULLED: ' + reponame));
              })();
            } else {
              shell.ls('.');
              console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + reponame));
              shell.exec(baseURL.toString() + selecteduser['value'] + '/' + reponame + '.git');
            }
          }
          shell.cd(basedir);
        }

        /**
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
        ]); */
      })();
    });

}

module.exports = { start }
