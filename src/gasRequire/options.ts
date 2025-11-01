import type { PathLike } from "node:fs"
import path from "node:path"

export interface IOptions {
  filter: (file: PathLike) => boolean
}

function filter(file: PathLike) {
  const ext = path.extname(file.toString())
  return ext === '.ts' || ext === '.js' || ext === '.gs'
}

export const defaultOptions = {
  filter
}
