/**
 * Author: Domenico Monaco <domenico@tecnologieperpersone.it>
 * License: GPL v3 or later
 * Copyright: 2022 Tecnologie per Persone di Domenico Monaco
 * Url: https://www.tecnologieperpersone.it
 */

const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

const all = {
  gitHubApi: {
    user: (user) => { return "https://api.github.com/users/" + user },
    reposList: (user) => { return "https://api.github.com/users/" + user + "/repos" },
    repo: (user, repo) => { return "https://api.github.com/repos/" + user + "/" + repo }
  },
  gitUrl: {
    rootUrl: process.env.ROOTGITHTTPURL,
    userRepo: (user, repo) => {
      return process.env.ROOTGITHTTPURL + "/" + user + "/" + repo
    }
  },
  localFileSystem: {
    rootDir: path.resolve(process.env.ROOTFOLDER),
    userList: path.resolve(process.env.ROOTFOLDER + "/" + process.env.BASEFOLDER),
    userReposList: (user) => {
      return path.resolve(process.env.ROOTFOLDER + "/" + process.env.BASEFOLDER + "/" + user)
    },
    userRepo: (user, repo) => {
      return path.resolve(env.ROOTFOLDER + "/" + process.env.BASEFOLDER + "/" + user + "/" + repo)
    }
  },
  localHttp: {
    rootUrl: process.env.BASEURL,
    usersList: process.env.BASEURL + process.env.BASEFOLDER + "/",
    userReposList: (user) => {
      return process.env.BASEURL + process.env.BASEFOLDER + "/" + user + "/"
    },
    userRepo: (user, repo) => {
      return process.env.BASEURL + process.env.BASEFOLDER + "/" + user + "/" + repo + "/";
    }
  }
}

module.exports = { all }
