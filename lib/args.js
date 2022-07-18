#!/usr/bin/env node

const {argv} = require("yargs")
  //.scriptName("<script>.js")
  .command('custom-repo [name]', '', (yargs) => {
    yargs.positional('name', {
      type: 'string',
      default: null,
      describe: 'the name of your repo'
    })
  }, function (argv) {
    console.log('hello', argv.name, 'welcome to yargs!')
  })
  .example(
    "$0 custom-repo examplerepo",
    "Bypass .env configuration REPONAME and use 'examplerepo' as repo name"
  );

  module.exports = {argv};
