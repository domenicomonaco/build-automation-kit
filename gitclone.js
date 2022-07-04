const shell = require('shelljs')
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require("dotenv");

//LOAD ENNV
dotenv.config();

function gitClone(ex) {
  const baseURL = process.env.BASEGITURL;
  const basefolder = process.env.BASEFOLDER;

  if (fs.existsSync(basefolder)) {

    fs.createReadStream('users.csv')
      .pipe(csv())
      .on('data', (row) => {
        shell.cd(basefolder);
        
        console.log('################# \n');
        console.log(row['Cognome'], row['Username github']);
        //console.log(row);

        if (fs.existsSync(row['Username github'])) {
          shell.cd(row['Username github']);
          if (fs.existsSync(ex)) {
            shell.cd(ex);

            shell.exec('git reset --hard HEAD');
            shell.exec('git pull --force');

            shell.cd('..');

          } else {
            shell.exec(baseURL.toString() + row['Username github'] + '/' + ex + '.git');
          }
          shell.cd('..');
        }
        else {
          shell.mkdir('-p', row['Username github']);
        }
        shell.cd('..');
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
      });

  }

}


for (let i = 1; i <process.env.LOOPN;i++) {
  gitClone(process.env.REPONAME);
}
