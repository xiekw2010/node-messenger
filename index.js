const fork = require('child_process').fork
const cfork = require('cfork')

function startApp() {
  // 多个进程模型
  fork('./agent.js')
  cfork({
    exec: './app.js',
    count: 3,
  })

  // 单个进程模型
  // require('./agent')
  // require('./app')
}

startApp()