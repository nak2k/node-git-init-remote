#!/usr/bin/env node
/*
 * The MIT License
 *
 * Copyright 2013-2013 Kengo Nakatsuka <kengo.nakatsuka@gmail.com>
 *
 */
var spawn = require('child_process').spawn;

function git_sinit() {
  var optimist = require('optimist')
    .usage('usage: git sinit [-q | --quiet] [--bare] [--template=<template_directory>]\n' +
           '           [--separate-git-dir <git dir>]\n' +
           '           [--shared[=<permissions>]] <remote_directory>')
    .boolean(['q', 'bare', 'help'])
    .alias({
      q: 'quiet'
    })
    .describe({
      help: 'Show help'
    })
    .check(function(argv) {
      if (argv.help) {
        optimist.showHelp();
        process.exit(0);
      }
    })
  var argv = optimist.argv;

  var params = argv._;
  if (params.length === 0) {
    die('remote_directory is not specified.');
  }

  var remoteDir = params[0];
  var ss = remoteDir.split(':');
  if (ss.length !== 2) {
    die("'%s' is not a remote directory.", remoteDir);
  }

  var remoteHost = ss[0];
  var remotePath = ss[1];
  if (remoteHost.length === 0) {
    die("Remote host is not specified.");
  }
  if (remotePath.length === 0) {
    die("Remote path is not specified.");
  }

  var gitArgs = ['git', 'init'];
  if (argv.q) {
    gitArgs.push('--quiet');
  }
  if (argv.bare) {
    gitArgs.push('--bare');
  }
  gitArgs.push(remotePath);

  var spawnArgs = [remoteHost];
  spawnArgs.push(gitArgs.join(' '));

  spawn('ssh', spawnArgs, {
    stdio: 'inherit'
  });
}

function die() {
  console.error.apply(null, arguments);
  process.exit(1);
}

git_sinit();
