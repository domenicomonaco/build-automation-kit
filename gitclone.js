const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
var clc = require("cli-color");
require('shelljs-plugin-clear');

const git = require('./lib/gitop.js');

//LOAD ENNV
dotenv.config();
shell.clear();

function gitClone(ex) {
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;

  //if (fs.existsSync(basefolder)) {

    fs.createReadStream('users.csv')
      .pipe(csv())
      .on('data', (row) => {
        shell.clear();
        console.log('( ͡° ͜ ͡° ) BUILD AUTOMATION KIT |--------------------------------------------- \n');
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
          shell.cd(ex);

          git.git_reset_and_pull();

          console.log(clc.bgGreenBright('PULLED: ' + ex));

          shell.cd('..');

        } else {
          console.log(clc.bgRed('NOT EXIST folder: ' + ex));
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

  for (let i = 0; i <= parseInt(response['value']); i++) {
    gitClone(process.env.REPONAME);
  }

})();

