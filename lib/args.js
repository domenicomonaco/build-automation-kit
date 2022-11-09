/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const { argv } = require("yargs")
  //.scriptName("<script>.js")
  .command('custom-repo [name]', '', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      default: process.env.REPONAME,
      describe: 'the name of your repo'
    })
  }, function (argv) {
    console.log('hello', argv.name, 'welcome to yargs!')
  })
  .example(
    "$0 custom-repo examplerepo",
    "Bypass .env configuration REPONAME and use 'examplerepo' as repo name"
  );

module.exports = { argv };
