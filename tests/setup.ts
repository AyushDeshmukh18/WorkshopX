import { beforeEach, afterEach, vi } from 'vitest';

vi.mock('server-only', () => ({}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
