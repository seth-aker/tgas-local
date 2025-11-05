import {test, expect} from 'vitest'
import {gasRequire} from 'tgas-local'

const gLib = gasRequire('./src')

test('helloWorld() example', () => {
  const hello = gLib.helloWorld()
  expect(hello).toEqual("Hello World!")
})