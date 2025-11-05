import { test, expect, vi } from "vitest";
import { type IGlobalMocksObject, gasRequire } from 'tgas-local'

const globalMocks: IGlobalMocksObject = {
  UrlFetchApp: {
    fetch: vi.fn()
  }
} 
const gLib = gasRequire("./src", globalMocks)

test('test global mock object', () => {
  // UrlFetchApp.fetch is now a mocked function.
  gLib.UrlFetchApp.fetch.mockReturnValue("Hello from UrlFetchApp!")

  const response = gLib.useUrlFetchApp()
  
  expect(response).toEqual("Hello from UrlFetchApp!")
  expect(gLib.UrlFetchApp.fetch).toHaveBeenCalled()
})