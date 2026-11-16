import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fs } from 'memfs'
import path from 'node:path'
import { sortFiles } from '../src/sortFiles.js'

let root: string
let warn: ReturnType<typeof vi.spyOn>

function touch(...relPaths: string[]): string[] {
  return relPaths.map(rel => {
    const abs = path.join(root, rel)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, '')
    return abs
  })
}

function writeClasp(config: unknown) {
  fs.writeFileSync(path.join(root, '.clasp.json'), typeof config === 'string' ? config : JSON.stringify(config))
}

beforeEach(() => {
  root = fs.realpathSync(fs.mkdtempSync(path.join('tgas-sort-'))).toString();
  warn = vi.spyOn(console, 'warn').mockImplementation(() => { })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('sortFiles', () => {
  test('puts filePushOrder entries first, in order, then the rest sorted', () => {
    const [a, b, c, d] = touch('src/a.ts', 'src/b.ts', 'src/c.ts', 'src/d.ts')
    writeClasp({ filePushOrder: ['src/c.ts', 'src/a.ts'] })

    expect(sortFiles([d!, b!, a!, c!], 'clasp', root)).toEqual([c, a, b, d])
    expect(warn).not.toHaveBeenCalled()
  })

  test('defaults to clasp ordering', () => {
    const [a, b] = touch('a.ts', 'b.ts')
    writeClasp({ filePushOrder: ['b.ts'] })

    expect(sortFiles([a!, b!], undefined, root)).toEqual([b, a])
  })

  test('resolves claspRoot relative to process.cwd()', () => {
    const [a, b] = touch('proj/a.ts', 'proj/b.ts')
    fs.writeFileSync(path.join(root, 'proj', '.clasp.json'), JSON.stringify({ filePushOrder: ['b.ts'] }))
    vi.spyOn(process, 'cwd').mockReturnValue(root)

    expect(sortFiles([a!, b!], 'clasp', 'proj')).toEqual([b, a])
  })

  test('resolves filePushOrder against the .clasp.json directory, not rootDir', () => {
    const [a, b] = touch('src/a.ts', 'src/b.ts')
    writeClasp({ rootDir: 'src', filePushOrder: ['src/b.ts'] })

    expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
  })

  test('accepts relative input paths and returns absolute paths', () => {
    const [a, b] = touch('a.ts', 'b.ts')
    writeClasp({ filePushOrder: ['b.ts'] })
    const relativeToCwd = [a!, b!].map(p => path.relative(process.cwd(), p))

    expect(sortFiles(relativeToCwd, 'clasp', root)).toEqual([b, a])
  })

  test('falls back to filesystem order with a warning when .clasp.json is missing', () => {
    const [a, b, c] = touch('a.ts', 'b.ts', 'c.ts')

    expect(sortFiles([c!, a!, b!], 'clasp', root)).toEqual([a, b, c])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no .clasp.json'))
  })

  test('does not read clasp.json without the leading dot', () => {
    const [a, b] = touch('a.ts', 'b.ts')
    fs.writeFileSync(path.join(root, 'clasp.json'), JSON.stringify({ filePushOrder: ['b.ts'] }))

    expect(sortFiles([a!, b!], 'clasp', root)).toEqual([a, b])
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no .clasp.json'))
  })

  test('uses filesystem order when .clasp.json has no filePushOrder', () => {
    const [a, b] = touch('a.ts', 'b.ts')
    writeClasp({ scriptId: 'abc' })

    expect(sortFiles([b!, a!], 'clasp', root)).toEqual([a, b])
    expect(warn).not.toHaveBeenCalled()
  })

  test("'filesystem' mode ignores .clasp.json entirely", () => {
    const [a, b] = touch('a.ts', 'b.ts')
    writeClasp('{ not valid json')

    expect(sortFiles([b!, a!], 'filesystem', root)).toEqual([a, b])
    expect(warn).not.toHaveBeenCalled()
  })

  test('warns about filePushOrder entries that match no file', () => {
    const [a] = touch('a.ts')
    writeClasp({ filePushOrder: ['missing.ts', 'a.ts'] })

    expect(sortFiles([a!], 'clasp', root)).toEqual([a])
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('missing.ts'))
  })

  test('duplicate filePushOrder entries do not duplicate files or warn', () => {
    const [a, b] = touch('a.ts', 'b.ts')
    writeClasp({ filePushOrder: ['b.ts', './b.ts'] })

    expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
    expect(warn).not.toHaveBeenCalled()
  })

  test('duplicate input files are returned once', () => {
    const [a] = touch('a.ts')

    expect(sortFiles([a!, a!], 'filesystem', root)).toEqual([a])
  })

  test('throws a descriptive error for malformed .clasp.json', () => {
    const [a] = touch('a.ts')
    writeClasp('{ not valid json')

    expect(() => sortFiles([a!], 'clasp', root)).toThrow(/failed to parse .*\.clasp\.json/)
  })

  test('returns an empty array for no files', () => {
    writeClasp({ filePushOrder: [] })

    expect(sortFiles([], 'clasp', root)).toEqual([])
  })

  describe('.clasp.json edge cases', () => {
    test('accepts a .clasp.json with a UTF-8 BOM', () => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp('﻿' + JSON.stringify({ filePushOrder: ['b.ts'] }))

      expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
    })

    test('accepts JSON5 syntax like clasp does', () => {
      const [a, b, c] = touch('a.ts', 'b.ts', 'c.ts')
      writeClasp(`{
        // load helpers first
        scriptId: 'abc', /* unquoted keys, single quotes */
        "filePushOrder": [
          'c.ts',
          "b.ts", // trailing comma
        ],
      }`)

      expect(sortFiles([a!, b!, c!], 'clasp', root)).toEqual([c, b, a])
      expect(warn).not.toHaveBeenCalled()
    })

    test('throws a descriptive error for an empty .clasp.json', () => {
      const [a] = touch('a.ts')
      writeClasp('')

      expect(() => sortFiles([a!], 'clasp', root)).toThrow(/failed to parse/)
    })

    test.each([
      ['null', 'null'],
      ['an array', '[]'],
      ['a number', '42'],
    ])('falls back to filesystem order when .clasp.json is %s', (_label, contents) => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp(contents)

      expect(sortFiles([b!, a!], 'clasp', root)).toEqual([a, b])
    })

    test.each([
      ['a string', 'b.ts'],
      ['an object', { 0: 'b.ts' }],
      ['null', null],
    ])('warns and ignores filePushOrder when it is %s', (_label, filePushOrder) => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp({ filePushOrder })

      expect(sortFiles([b!, a!], 'clasp', root)).toEqual([a, b])
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('not an array'))
    })

    test('skips non-string filePushOrder entries with a warning instead of crashing', () => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp({ filePushOrder: [1, null, { path: 'a.ts' }, 'b.ts'] })

      expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
      expect(warn).toHaveBeenCalledTimes(3)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('non-string'))
    })

    test('an empty-string entry resolves to the clasp root and is reported as not found', () => {
      const [a] = touch('a.ts')
      writeClasp({ filePushOrder: [''] })

      expect(sortFiles([a!], 'clasp', root)).toEqual([a])
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('not found'))
    })
  })

  describe('path resolution edge cases', () => {
    test('matches non-normalized filePushOrder entries', () => {
      const [a, b] = touch('src/a.ts', 'src/b.ts')
      writeClasp({ filePushOrder: ['./src//lib/../b.ts'] })

      expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
      expect(warn).not.toHaveBeenCalled()
    })

    test('matches non-normalized input paths and returns them normalized', () => {
      const [a, b] = touch('src/a.ts', 'src/b.ts')
      writeClasp({ filePushOrder: ['src/b.ts'] })
      const messyB = path.join(root, 'src', 'x', '..') + '/./b.ts'

      expect(sortFiles([a!, messyB], 'clasp', root)).toEqual([b, a])
    })

    test('accepts absolute filePushOrder entries', () => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp({ filePushOrder: [b] })

      expect(sortFiles([a!, b!], 'clasp', root)).toEqual([b, a])
    })

    test('resolves entries that point outside the clasp root', () => {
      const [shared, b] = touch('shared/util.ts', 'proj/b.ts')
      fs.writeFileSync(path.join(root, 'proj', '.clasp.json'), JSON.stringify({ filePushOrder: ['../shared/util.ts'] }))

      expect(sortFiles([b!, shared!], 'clasp', path.join(root, 'proj'))).toEqual([shared, b])
    })

    test.each(['proj/', './proj', 'proj/../proj'])('normalizes claspRoot %j', claspRoot => {
      const [a, b] = touch('proj/a.ts', 'proj/b.ts')
      fs.writeFileSync(path.join(root, 'proj', '.clasp.json'), JSON.stringify({ filePushOrder: ['b.ts'] }))
      vi.spyOn(process, 'cwd').mockReturnValue(root)

      expect(sortFiles([a!, b!], 'clasp', claspRoot)).toEqual([b, a])
    })

    test('the same file given as relative and absolute paths is returned once', () => {
      const [a] = touch('a.ts')

      expect(sortFiles([a!, path.relative(process.cwd(), a!)], 'filesystem', root)).toEqual([a])
    })

    test('a duplicated input that is also in filePushOrder appears once, in the ordered section', () => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp({ filePushOrder: ['b.ts'] })

      expect(sortFiles([b!, a!, b!], 'clasp', root)).toEqual([b, a])
    })

    test('entries are matched exactly, not by basename or extension', () => {
      const [a, b] = touch('src/a.ts', 'src/b.ts')
      // b.js is the pushed output name; the local source is b.ts, and b.ts at the root does not exist
      writeClasp({ filePushOrder: ['src/b.js', 'b.ts'] })

      expect(sortFiles([a!, b!], 'clasp', root)).toEqual([a, b])
      expect(warn).toHaveBeenCalledTimes(2)
    })
  })

  describe('ordering', () => {
    test('every input listed in filePushOrder keeps that exact order', () => {
      const [a, b, c] = touch('a.ts', 'b.ts', 'c.ts')
      writeClasp({ filePushOrder: ['c.ts', 'a.ts', 'b.ts'] })

      expect(sortFiles([a!, b!, c!], 'clasp', root)).toEqual([c, a, b])
    })

    test('unlisted files sort like clasp (localeCompare), not by UTF-16 code unit', () => {
      const [lower, upper] = touch('apple.ts', 'Banana.ts')

      // plain .sort() would put 'Banana' before 'apple'
      expect(sortFiles([upper!, lower!], 'filesystem', root)).toEqual([lower, upper])
    })

    test('unlisted files in subdirectories sort by full path', () => {
      const [z, nested, y] = touch('src/z.ts', 'src/lib/a.ts', 'src/y.ts')

      expect(sortFiles([z!, y!, nested!], 'filesystem', root)).toEqual([nested, y, z])
    })

    test('does not mutate the input array', () => {
      const [a, b] = touch('a.ts', 'b.ts')
      writeClasp({ filePushOrder: ['b.ts'] })
      const input = [a!, b!]

      sortFiles(input, 'clasp', root)
      expect(input).toEqual([a, b])
    })

    test("'filesystem' mode does not warn when .clasp.json is missing", () => {
      const [a] = touch('a.ts')

      sortFiles([a!], 'filesystem', root)
      expect(warn).not.toHaveBeenCalled()
    })
  })
})
