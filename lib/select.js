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

  visuals.header();
  if (
    operation == 'custom'
  ) {

    let repo_info = {};
    (async () => {
      let response = await prompts({
        type: 'text',
        name: 'username',
        message: 'What is the github user/organizzation name?'
      });

      repo_info['username'] = response.username;

      repo_info['baseURL'] = 'https://github.com/';
      repo_info['api_url_user'] = 'https://api.github.com/users/' + repo_info['username'];
      repo_info['api_url_user_repos'] = 'https://api.github.com/users/' + repo_info['username'] + '/repos';

      /*response = await prompts({
        type: 'text',
        name: 'repository',
        message: 'What is the repository name?'
      });

      repo_info['repository'] = response.repository;
      repo_info['api_url_user_repo_selected'] = 'https://api.github.com/repos/' + repo_info['username'] + '/' + repo_info['repository'];

      console.table(repo_info);*/

      let user_repolist = [];

      axios
        .get(repo_info['api_url_user_repos'])
        .then(res => {
          console.log(`statusCode: ${res.status}`);
          //console.log(res.data);

          res.data.forEach(repo => {
            //console.log(repo.name);
            user_repolist.push(
              {
                title: repo.name,
                value: repo.name
              }
            );

          });

          (async () => {
            let reposelected = await prompts([
              {
                type: 'autocomplete',
                name: 'value',
                message: 'Pick a USER Repo',
                choices: user_repolist,
                initial: 0
              }
            ]);
          })();

        })
        .catch(error => {
          console.error(error);
        });

    })();

    process.exit;
    return 0;
  }

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
              { title: 'Update from remote', value: 'soft_update' },
              { title: 'Discard and Update', value: 'hard_update' },
              { title: 'Delete and Clone', value: 'reinitialize' },
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
