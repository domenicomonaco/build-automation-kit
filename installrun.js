const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const { exit } = require('process');
const dotenv = require("dotenv");
const prompts = require('prompts');
const open=require('open');

//LOAD ENNV
dotenv.config();


function git_reset_and_pull(){
  shell.exec('git reset --hard HEAD');
  shell.exec('git pull --force');
}

function git_rm_and_clone(ex, url){
  shell.rm('-rf', ex);
  shell.exec(url + '.git');
}

function install(ex) {
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

        //console.log(response);
        (async () => {
          const what = await prompts([
            {
              type: 'autocomplete',
              name: 'value',
              message: 'Pick a action',
              choices: [
                { title: 'Pull from Git', value: 'update' },
                { title: 'Install & Run', value: 'instrun' },
                { title: 'Pull, Install & Run', value: 'upinstrun' },
                { title: 'Delete locally and Re-Clone', value: 'reset' },
                { title: 'Pull & Open to the browser', value: 'openbrowser'}],
              initial: 4
            }
          ]);

          //console.log(what);
          if (what['value'] == 'update') {
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {
                  shell.cd(ex);
                  //GIT RESET AND PULL
                  git_reset_and_pull();
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
                  shell.exec('git reset --hard HEAD');
                  shell.exec('git pull --force');
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
                git_rm_and_clone(ex,thisurl);
              }
            }
          } else if(what['value']=='openbrowser'){
            if (fs.existsSync(basefolder)) {
              shell.cd(basefolder);
              if (fs.existsSync(response['value'])) {
                shell.cd(response['value']);
                if (fs.existsSync(ex)) {
                  shell.cd(ex);
                  git_reset_and_pull();
                  open(process.env.BASELOCALURL.toString()+response['value']+'/'+ex);
                }
              }
            }
          }
        })();
      })();
    });
}

install(process.env.REPONAME);
