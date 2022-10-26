/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const shell = require('shelljs');
 require('shelljs-plugin-clear');

function header(){
  shell.clear();
  console.log('        //////  \r');
  console.log('___oOOo( ͡° ͜ ͡° )oOOo_[BAK IS BUILD AUTOMATION KIT, GNU GPL v3] \n');
}

module.exports = {header }
