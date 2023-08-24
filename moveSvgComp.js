#!/usr/bin/env node
'use strict'
const fs = require('fs')

// Copy SvgIcon to project folder
fs.copyFile('./node_modules/calm-svg-sprite/SvgIcon.vue', './src/components/SvgIcon.vue', (err) => {
  if (err) throw err;
  console.log('SvgIcon.vue was created or overwritten in the "/src/components" folder');
});
  