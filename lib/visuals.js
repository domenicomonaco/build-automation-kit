const shell = require('shelljs');
require('shelljs-plugin-clear');

function header(){
  shell.clear();
  console.log('        //////  \r');
  console.log('___oOOo( ͡° ͜ ͡° )oOOo____[BUILD AUTOMATION KIT] __________[GNU GPL v3] \n');
}

module.exports = {header }
