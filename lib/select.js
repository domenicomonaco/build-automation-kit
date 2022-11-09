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

let info = {};
info['username'] = ""; //response.username;
info['baseURL'] = 'https://github.com/';
info['base_previewURL'] = 'http://main.loc/build-automation-kit/';
//info['api_url_user'] = 'https://api.github.com/users/' + repo_info['username'];
//repo_info['api_url_user_repos'] = 'https://api.github.com/users/' + repo_info['username'] + '/repos';


//LOAD ENNV
dotenv.config();

function start(
  reponame,
  filecsv,
) {

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
    }).on('end', () => {
      function entrypoint(process, reponame, info, baseURL, selecteduser) {
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

          function useroption(process, reponame, info, baseURL, selecteduser) {
            ///////////////////////////////////////////////////////////////////////////////////
            console.log('> LINK /////////////////////////////////////////////');

            console.log(clc.bgBlueBright('> ') + clc.bgBlue(info['baseURL'] + selecteduser['value']));
            console.log(clc.bgBlueBright('> ') + clc.bgBlue(info['baseURL'] + selecteduser['value'] + '/' + reponame));
            console.log(clc.bgBlueBright('> ') + clc.bgBlue(baseURL.toString() + selecteduser['value'] + '/' + reponame + '.git'));

            console.log('');
            console.log(clc.bgRedBright('> ') + clc.bgRed(info['base_previewURL'] + process.env.BASEFOLDER));
            console.log(clc.bgRedBright('> ') + clc.bgRed(info['base_previewURL'] + process.env.BASEFOLDER + '/' + selecteduser['value']));
            console.log(clc.bgRedBright('> ') + clc.bgRed(info['base_previewURL'] + process.env.BASEFOLDER + '/' + selecteduser['value'] + '/' + reponame));
            console.log('');
            console.log(clc.bgGreenBright('> ') + clc.bgGreen(process.env.BASEFOLDER + '/' + selecteduser['value']));
            console.log(clc.bgGreenBright('> ') + clc.bgGreen(process.env.BASEFOLDER + '/' + selecteduser['value'] + '/' + reponame));

            console.log('_____________________________');
            ///////////////////////////////////////////////////////////////////////////////////

            (async () => {
              let gitOP = await prompts([
                {
                  type: 'autocomplete',
                  name: 'value',
                  message: 'Pick a GIT Operation',
                  choices: [
                    { title: 'Update from remote', value: 'soft_update' },
                    { title: 'Discard and update', value: 'hard_update' },
                    { title: 'Delete and re-clone', value: 'hard_init' },
                    { title: 'Change user', value: 'change_user' },
                    { title: 'Exit', value: 'exit' }
                  ],
                  initial: 0
                }
              ]);

              if (gitOP['value'] == 'change_user') {
                entrypoint(process, reponame, info, baseURL);
              } else if (gitOP['value'] == 'exit') {
                process.exit(1);
              } else if (gitOP['value'] == 'soft_update') {
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
                //Back to user
                useroption(process, reponame, info, baseURL, selecteduser);
              } else if (gitOP['value'] == 'hard_init') {
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
                //Back to user
                useroption(process, reponame, info, baseURL, selecteduser);
              } else if (gitOP['value'] == 'hard_update') {
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

                //Back to user
                useroption(process, reponame, info, baseURL, selecteduser);
              }

            })();
          }

          useroption(process, reponame, info, baseURL, selecteduser);

        })();
      }
      entrypoint(process, reponame, info, baseURL);
    });

}

module.exports = { start }
