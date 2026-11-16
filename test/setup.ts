import { beforeEach, vi } from "vitest";
import {vol} from 'memfs'
vi.mock('node:fs');

beforeEach(() => {
  vol.reset();
})
