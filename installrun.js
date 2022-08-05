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
const visuals = require('./lib/visuals.js');
var clc = require("cli-color");
require('shelljs-plugin-clear');
const path = require('path');

//LOAD ENNV
dotenv.config();

const git = require('./lib/gitop.js');

function install(ex) {
  const dirPath = path.join(__dirname);
  const basefolder = process.env.BASEFOLDER;
  let listofuser = [];

  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (row) => {
      listofuser.push({
        title: row['cognome'] + ' ' + row['nome'] + ' @' + row['gitusername'],
        value: row['gitusername']
      });
    }).on('end', () => {

      function prompt() {

        visuals.header();

        (async () => {
          const response = await prompts([
            {
              type: 'autocomplete',
              name: 'value',
              message: 'Pick a user',
              choices: listofuser,
              initial: 0
            }
          ]);


          let what = await prompts([
            {
              type: 'autocomplete',
              name: 'value',
              message: 'Pick a action',
              choices: [
                { title: 'Pull from Git and Open VS CODE', value: 'update' },
                { title: 'Install & Run', value: 'instrun' },
                { title: 'Pull, Install & Run', value: 'upinstrun' },
                { title: 'Delete locally and Re-Clone', value: 'reset' },
                { title: 'Pull & Open to the browser', value: 'openbrowser' },
                { title: 'Install Laravel and open browser', value: 'instalaravel' }],
              initial: 5
            }
          ]);

          if (what['value'] == 'update') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {
                  shell.cd(ex);
                  git.git_reset_and_pull();
                  console.log(clc.bgGreenBright('[V] Opening CODE: ' + ex));
                  shell.exec('code .')
                }
              }
            }
          } else if (what['value'] == 'instrun') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {
                  shell.cd(ex);
                  shell.exec('nvm use ' + process.env.NODEVER);
                  shell.exec('npm i');
                  shell.exec('npm run serve');
                }
              }
            }
          } else if (what['value'] == 'upinstrun') {

            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {
                  shell.cd(ex);
                  git.git_reset_and_pull();
                  shell.exec('nvm use ' + process.env.NODEVER);
                  shell.exec('npm i');
                  shell.exec('npm run serve');

                }
              }
            }
          } else if (what['value'] == 'reset') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                const thisurl = process.env.BASEGITURL.toString() + response['value'] + '/' + ex;
                git.git_rm_and_clone(ex, thisurl);
                shell.exec('code ' + ex);

              }
            }
          } else if (what['value'] == 'openbrowser') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {

                  shell.exec('code ' + ex);

                  console.log(clc.bgGreenBright('[V] Not exist folder: ' + ex));
                  shell.cd(ex);
                  console.log(clc.bgCyanBright('[>] ' + ex));
                  git.git_reset_and_pull();
                  open(process.env.BASELOCALURL.toString() + response['value'] + '/' + ex);
                } else {
                  console.log(clc.bgRedBright('[X] Not exist folder: ' + ex));
                }
              }
            }
          } else if (what['value'] == 'instalaravel') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {

                  shell.exec('code ' + ex);

                  console.log(clc.bgGreenBright('[V] Not exist folder: ' + ex));
                  shell.cd(ex);
                  console.log(clc.bgCyanBright('[>] ' + ex));
                  git.git_reset_and_pull();

                  shell.exec(process.env.PATHDOCKER.toString() + response['value'] + '/' + ex + '/');
                  open(process.env.BASELOCALURL.toString() + response['value'] + '/' + ex + '/public');

                } else {
                  console.log(clc.bgRedBright('[X] Not exist folder: ' + ex));
                }
              }
            }
          }



          let rep = await prompts([
            {
              type: 'autocomplete',
              name: 'value',
              message: 'Pick a action',
              choices: [
                { title: 'Restart', value: 'restart' },
                { title: 'Exit', value: 'exit' }],
              initial: 0
            }
          ]);

          if (rep['value'] == 'restart') {
            shell.cd(dirPath);
            prompt();
          } else if (rep['value'] == 'exit') {
            process.exit(1);
          }


        })();
      }
      prompt();
    });

}

install(process.env.REPONAME);
