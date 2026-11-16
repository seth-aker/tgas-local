// Recommended way to mock fs in vitest
const { fs } = require('memfs')
module.exports = fs
