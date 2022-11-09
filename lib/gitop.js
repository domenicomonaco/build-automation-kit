/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const shell = require('shelljs');

function git_reset_and_pull() {
  shell.exec('git clean -f');
  shell.exec('git reset --hard HEAD');
  // --soft instead of --hard prevent recursivley reset on parent RESPOSITORY
  shell.exec('git fetch');
  shell.exec('git pull --force');
}

function git_soft_pull() {
  shell.exec('git fetch');
  shell.exec('git pull --force');
}

function git_rm_and_clone(ex, url) {
  shell.rm('-rf', ex);
  shell.exec(url + '.git');
}

module.exports = { git_reset_and_pull, git_rm_and_clone, git_soft_pull }
