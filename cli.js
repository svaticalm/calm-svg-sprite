#!/usr/bin/env node
'use strict'
const meow = require('meow')
const spriteCreate = require('./createSprite')
const fs = require('fs')
const { extname, resolve } = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const readdirAsync = promisify(fs.readdir)

const cli = meow();

const readFolder = async folder => {
  let svgs = []
  const folderToRead = folder || './'
  try {
    const files = await readdirAsync(folderToRead)
    const filtered = files.filter(file => extname(file) === '.svg')
    if (filtered.length) {
      const filenames = filtered.map(file => file.replace('.svg', ''))
      writeIconsListFile(filenames)
      for (const file of filtered) {
        const data = await readFileAsync(resolve(folderToRead, file))
        svgs = [...svgs, data.toString()]
      }
      return Promise.resolve({ svgs, filenames })
    }
    return Promise.reject(`No svg files found in ${folderToRead}`)
  } catch (e) {
    Promise.reject(e)
  }
}

const writeIconsListFile = (filenames) => {
  const jsonContent = `/* eslint-disable */\nlet calmIcons = ${JSON.stringify(filenames)}; export default calmIcons;`;
    fs.writeFileSync(cli.input[1] ? cli.input[1] + '/calmIcons.js' : './', jsonContent, { encoding: 'utf8', flag: 'w' }, (err) => {
        if (err) {
            return console.log(err);
        }
        return false;
    });
}

const doSprite = ({ svgs, filenames }) => {
  const processId = n => filenames[n]
  return spriteCreate(svgs, {
    processId,
  })
}

readFolder(cli.input[0] ? cli.input[0] : './')
  .then(doSprite)
  .then(({ defs }) => {
    const output = `${defs}`;
    const inputFolder = cli.input[1] ? cli.input[1] + '/calm-sprite.svg' : './calm-sprite.svg';
    fs.appendFile(inputFolder, output, function (err) {
      if (err) throw err;
      console.log(`calm-sprite.svg added to the ${cli.input[1] ? cli.input[1] : './'} folder`);
    });
    return output;
  })
  .catch(e => console.log(e));