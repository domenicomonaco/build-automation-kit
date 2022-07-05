const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");
const prompts = require('prompts');
var clc = require("cli-color");

//LOAD ENNV
dotenv.config();

function gitClone(ex) {
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;

  //if (fs.existsSync(basefolder)) {

    fs.createReadStream('users.csv')
      .pipe(csv())
      .on('data', (row) => {

        console.log('------------------------------------------------------------------- \n');
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

        if (fs.existsSync(ex)) {
          shell.cd(ex);

          shell.exec('git reset --hard HEAD');
          shell.exec('git pull --force');

          shell.cd('..');

        } else {
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

