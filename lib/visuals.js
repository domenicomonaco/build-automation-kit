const shell = require('shelljs');
require('shelljs-plugin-clear');

function TEST() {
  console.log('TEST');
}
function header(){
  shell.clear();
  console.log('        //////  \r');
  console.log('___oOOo( ͡° ͜ ͡° )oOOo____BUILD AUTOMATION KIT _____________________ \n');
}


module.exports = { TEST, header }
