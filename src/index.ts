import * as esbuild from 'esbuild'
import { globSync } from 'glob'
import * as vm from 'node:vm';
import * as fs from 'node:fs';
import {DefaultGlobalMocks, type IGlobalMocksObject } from './globalMocks'
import { type IOptions, defaultOptions } from './options'

export function gasRequire(directory: string, globalMocks: IGlobalMocksObject = DefaultGlobalMocks, options?: IOptions) {
  
  const context = vm.createContext(globalMocks)
  
  const filterFunction = options?.filter ? options.filter : defaultOptions.filter;
  
  const files = globSync(directory, {
    cwd: process.cwd(),
    absolute: true
  })
  
  const gsFiles = files.filter(filterFunction)

  if(gsFiles.length === 0) {
    console.warn('TGAS-LOCAL: No GAS files found. Return context will be empty');
  }

  const typescriptString = gsFiles
    .map(file => fs.readFileSync(file, 'utf-8'))
    .join('\n\n// --- new file boundary ---\n\n')
  
  try {
    const { code: jsFiles} = esbuild.transformSync(typescriptString, {
      loader: 'ts',
      format: 'cjs',
      target: 'es2020'
    })

    vm.runInContext(jsFiles, context, {
      filename: 'local-gas.js'
    })

    return context
  } catch (err) {
    console.error("Failed to build or run GAS in-memory bundle:", err)
    process.exit(1)
  }
}