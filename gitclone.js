const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
const clc = require("cli-color");
require('shelljs-plugin-clear');
const open = require('open');
const path = require('path');

const visuals = require('./lib/visuals.js');

const git = require('./lib/gitop.js');

//LOAD ENNV
dotenv.config();
shell.clear();

function gitClone(ex, filecsv) {
  const basedir = path.join(__dirname);
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;

  //open to the broowser

  fs.createReadStream(filecsv)
    .pipe(csv())
    .on('data', (row) => {

      visuals.header();

      console.log(
        clc.red(row['nome']),
        clc.green(row['cognome']),
        clc.yellow('@' + row['gitusername']));

      if (fs.existsSync(basefolder) == false) {
        shell.mkdir('-p', basefolder);
      }
      shell.cd(basefolder);


      if (fs.existsSync(row['gitusername']) == false) {
        shell.mkdir('-p', row['gitusername']);
      }
      shell.cd(row['gitusername']);

      console.log(clc.bgCyanBright('[>] ' + ex));

      if (fs.existsSync(ex)) {
        console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERR: ' + ex));

        fs.readdirSync(ex, function(err, data) {
          if (data.length == 0) {
            console.log("Directory is empty!");
          } else {
            console.log("Directory is not empty!");
            console.log($data);
          }
        });

        shell.cd(ex);

        git.git_reset_and_pull();

        console.log(clc.bgGreenBright('PULLED: ' + ex));

      } else {
        console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + ex));
        shell.exec(baseURL.toString() + row['gitusername'] + '/' + ex + '.git');
      }

      shell.cd(basedir);

    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });

  //}

}

function gitCloneWrapper(
    reponame,
    notopenbrowser=true,
    filecsv) {
  (async () => {
    const response = await prompts({
      type: 'number',
      name: 'value',
      message: 'Quanti cicli vuoi fare?',
      initial: 1,
      validate: value => value == 0 ? `deve essere almeno 1` : true
    });

    if(notopenbrowser==false){
      open(process.env.BASELOCALURL.toString());
    }

    for (let i = 0; i <= parseInt(response['value']); i++) {
      gitClone(reponame, filecsv);
    }

  })();

}

module.exports = { gitCloneWrapper }
