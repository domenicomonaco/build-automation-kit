const shell = require('shelljs');

function TEST() {
  console.log('TEST');
}
function header(){
  console.log('        //////  \r');
  console.log('___oOOo( ͡° ͜ ͡° )oOOo____BUILD AUTOMATION KIT _____________________ \n');
}


module.exports = { TEST, header }
