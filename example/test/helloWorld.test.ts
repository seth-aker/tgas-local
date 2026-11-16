import {test, expect, vi} from 'vitest'
import {gasRequire } from 'tgas-local'

// Loads all files in ./src dir into gLib
const gLib = gasRequire('./src')

test('helloWorld() example', () => {
  const spy = vi.spyOn(console, 'log');
  gLib.helloWorld()
  expect(spy).toHaveBeenCalledWith("Hello World!");
})
