const shell = require('shelljs');

function TEST() {
  console.log('TEST');
}

function git_reset_and_pull() {
  shell.exec('git clean -f');
  shell.exec('git fetch');
  shell.exec('git reset --hard HEAD');
  shell.exec('git pull --force');
}

function git_rm_and_clone(ex, url) {
  shell.rm('-rf', ex);
  shell.exec(url + '.git');
}

module.exports = { TEST, git_reset_and_pull, git_rm_and_clone }
