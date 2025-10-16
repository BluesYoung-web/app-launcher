/*
 * @Author: zhangyang
 * @Date: 2025-10-16 16:05:59
 * @LastEditTime: 2025-10-16 16:16:45
 * @Description:
 */
/* eslint-disable no-restricted-globals */
import { vi } from 'vitest'

// Mock global objects that might not be available in test environment
Object.defineProperty(global, 'navigator', {
  value: {
    userAgent: '',
    clipboard: {
      writeText: vi.fn(),
    },
  },
  writable: true,
})

Object.defineProperty(global, 'document', {
  value: {
    createElement: vi.fn(),
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    execCommand: vi.fn(),
  },
  writable: true,
})

Object.defineProperty(global, 'window', {
  value: {
    isSecureContext: true,
  },
  writable: true,
})

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}
