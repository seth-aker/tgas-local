# tgas-local
Typescript support for running and testing [Google Apps Script](https://developers.google.com/apps-script/) (GAS) projects locally. 

## Why is this necessary?
This project is inspired by the project [gas-local](https://github.com/mzagorny/gas-local), but adds typescript support and modern module syntax. It is frustrating to have to compile your typescript files to javascript after any change in order to run tests on your local apps script files. This package removes that time consuming step, speeding up your development and testing process. 
Using this package allows you to run and test your apps script files locally in a node environment without needing to make any changes to the files before pushing or pulling your code to the apps script cloud environment using [clasp](https://developers.google.com/apps-script/guides/clasp).

## Installation
### Via npm
`npm i -D tgas-local @types/google-apps-script`

### Via pnpm
`pnpm i -D tgas-local @types/google-apps-script`

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

## Filtering
### Simple file exclusion
```javascript
// Use the options object to pass a filter function that will filter any unwanted files
// Note: glob is already only reading files with the current extentions .ts, .js, .gs
const options = {
  filterFunction: (filePath: string) => {
    return filePath === "some-file-to-not-include.ts"
  }
}
const gLib = gasRequire('./appscript-directory', mockServices, options)
```
### Custom Glob options
```javascript
const options = {
  globOptions: {
    cwd: './some-other-dir',
    absolute: true
    // ...etc
  }
}
```

## Contributing
Pull requests are welcome! I am always open to collaboration. 

Inspired by Mikhail Zagorny's [gas-local](https://github.com/mzagorny/gas-local) package, but with built in native typescript support.

Built with [esbuild](https://github.com/evanw/esbuild) and [glob](https://github.com/isaacs/node-glob)

## Useful links
[clasp](https://developers.google.com/apps-script/guides/clasp): Develop and manage googleappsscript projects locally
[gas-local](https://github.com/mzagorny/gas-local): Inspiration for this project
