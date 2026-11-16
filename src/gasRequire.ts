import * as esbuild from 'esbuild'
import { globSync } from 'glob'
import * as vm from 'node:vm';
import * as fs from 'node:fs';
import * as acorn from 'acorn';
import { generate } from 'astring';
import { DEFAULT_GLOBAL_MOCKS, type IGlobalMocksObject } from './globalMocks.js'
import { type IGasOptions, defaultOptions } from './options.js'
import { sortFiles } from './sortFiles.js'

export function gasRequire(directory: string, globalMocks?: IGlobalMocksObject, options?: IGasOptions) {
  const mocksObject = {
    ...DEFAULT_GLOBAL_MOCKS,
    ...globalMocks,
  };

  const context = vm.createContext(mocksObject)

  const filterFunction = options?.filter ? options.filter : defaultOptions.filter!;
  const globOptions = options?.globOptions ? options.globOptions : {
    cwd: process.cwd(),
    absolute: true
  }

  const files = globSync(`${directory}/**/*.{ts,js,gs}`, globOptions)

  const gsFiles = files.filter(filterFunction)

  if (gsFiles.length === 0) {
    console.warn('TGAS-LOCAL: No GAS files found. Return context will be empty');
  }

  try {
    const typescriptString = sortFiles(gsFiles.map(String), options?.fileOrder, options?.claspJsonRoot)
      .map(file => fs.readFileSync(file, 'utf-8'))
      .join('\n\n// --- new file boundary ---\n\n');

    const { code } = esbuild.transformSync(typescriptString, {
      loader: 'ts',
      format: 'esm',
      target: 'es2020'
    })
    const jsFiles = transformConstAndLet(code);

    vm.runInContext(jsFiles, context, {
      filename: 'local-gas.js'
    })

    return context
  } catch (err) {
    console.error("[tgas-local] Failed to build or run the GAS in-memory bundle:", err)
    throw err;
  }
}
// transforms const and let variable declarations to var, which makes them globally available
// this mirrors how GAS works across files in the same project.
function transformConstAndLet(code: string): string {
  const ast = acorn.parse(code, {
    // keep in sync with esbuild
    sourceType: 'module',
    ecmaVersion: 2020,
  });
  for (const node of ast.body) {
    if (node.type === 'VariableDeclaration') {
      node.kind = 'var'
    }
  }
  return generate(ast);
}
