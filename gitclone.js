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
require('./lib/args.js');

//LOAD ENNV
dotenv.config();
shell.clear();

function gitClone(ex) {
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;

    //open to the broowser

    fs.createReadStream('users.csv')
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

        console.log(clc.bgCyanBright('[>] '+ ex));
        if (fs.existsSync(ex)) {
          console.log(clc.bgGreenBright('[✔] OK, EXIST FOLDERr: ' + ex));
          shell.cd(ex);

          git.git_reset_and_pull();

          console.log(clc.bgGreenBright('PULLED: ' + ex));

          shell.cd('..');

        } else {
          console.log(clc.bgRed('[X] NOT EXIST FOLDER: ' + ex));
          shell.exec(baseURL.toString() + row['gitusername'] + '/' + ex + '.git');
        }

        shell.cd('../..');

      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });

  //}

}

(async () => {
  const response = await prompts({
    type: 'number',
    name: 'value',
    message: 'Quanti cicli vuoi fare?',
    initial: 1,
    validate: value => value == 0 ? `deve essere almeno 1` : true
  });

  open(process.env.BASELOCALURL.toString());

  for (let i = 0; i <= parseInt(response['value']); i++) {
    gitClone(process.env.REPONAME);
  }


})();

