'use strict';
const os = require('os');
const path = require('path')
const tmpDir = os.tmpDir();
let sockPath = path.join(tmpDir, 'test.sock');

if (process.platform === 'win32') {
  sockPath = sockPath.replace(/^\//, '');
  sockPath = sockPath.replace(/\//g, '-');
  sockPath = '\\\\.\\pipe\\' + sockPath;
}

exports.sockPath = sockPath