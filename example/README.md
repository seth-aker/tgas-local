# tgas-local Example App Usage

Sample use case for working with [Google Apps Scripts](https://developers.google.com/apps-script/)

## Workflow for testing a GAS Project Locally

### 1. Install Clasp and setup a local project
Follow the steps [here](https://developers.google.com/apps-script/guides/clasp) to get your project setup.

```bash
pnpm install -D @google/clasp @types/google-apps-script
pnpm clasp login
pnpm clasp create [yourScriptNameHere] # or pnpm clasp clone [scriptId]
```

If you cloned an existing project, you will have to manually change the extentions of the files from .js to .ts

### 2. Install testing library
This project will be using [Vitest](https://github.com/vitest-dev/vitest), but any typescript-supported testing library can be used.
```bash
pnpm install -D vitest
```

### 3. Develop your project
```javascript
// src/helloWorld.ts
// Notice how this function is not exported.
function helloWorld() {
  return "Hello World!"
}
```
### 4. Setup your test files and load your src directory.
```javascript
// test/helloWorld.test.ts
import {test, expect} from 'vitest'
import {gasRequire} from 'tgas-local'

const gLib = gasRequire('./src')

test('helloWorld() example', () => {
  const hello = gLib.helloWorld()
  expect(hello).toEqual("Hello World!")
})
```

### 5. Setup a build script
