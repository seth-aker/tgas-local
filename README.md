# tgas-local
Typescript support for running and testing [google apps script](https://developers.google.com/apps-script/) projects locally. 

## Why is this necessary?
In Google Apps Script projects every function and variable declared in the top level of a file is considered a part of the global scope of a gas project. This is in stark contrast to node, where every file explicitly requires exports in order for a function to be visible to other files. This presents challenges when developing and testing google apps script code locally, and even more so when developing a project using typescript. This package aims to reduce the configuration necessary for running tests on your typescript code. Instead of having to compile to javascript before running your tests, this library leverages esbuild to virtually compile your typescript code and then attach it to a global object for you to use.

## Installation
### Via npm
`npm i tgas-local`

### Via pnpm
`pnpm i tgas-local`

## Usage
```javascript
// import the gasRequire function
import { gasRequire } from 'tgas-local'

// Pass the relative path to the directory that includes your apps script files.
const gLib = gasRequire('./path-to-local-googleappsscript-directory')

// Call your apps script functions from the gLib object
gLib.yourAppsScriptFunction()
```

## Mocking Google Services
```javascript
import { type IGlobalMocksObject, gasRequire } from 'tgas-local'

// Create an object that mocks the functions of an Apps Script Service
const mockServices: IGlobalMocksObject = {
  UrlFetchApp: {
    fetch: () => "fetch called!",
    fetchAll: () => "fetchAll called!"
  }
}
// pass it to gasRequire
const gLib = gasRequire('./appsscript-directory', mockServices)

gLib.UrlFetchApp.fetch() // returns a the string "fetch called!"
```

Inspired by [Mikhail Zagorny's](https://github.com/mzagorny) [gas-local](https://github.com/mzagorny/gas-local) package, but with built in native typescript support.

Built with [esbuild](https://github.com/evanw/esbuild) and [glob](https://github.com/isaacs/node-glob)

## Useful links
[clasp](https://developers.google.com/apps-script/guides/clasp): Develop and manage googleappsscript projects locally
