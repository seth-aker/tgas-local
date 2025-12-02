import { test, expect, vi } from "vitest";
import { gasRequire } from 'tgas-local'

const glib = gasRequire('./src');

test('Should include global constants in the context', () => {
  expect(glib.GLOBAL_CONSTANT).toEqual(500);
})