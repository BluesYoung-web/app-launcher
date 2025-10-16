import { beforeEach, describe, expect, it } from 'vitest'
import { DeviceDetector } from '../utils/device'

// Mock navigator
const mockNavigator = {
  userAgent: '',
}

Object.defineProperty(globalThis, 'navigator', {
  value: mockNavigator,
  writable: true,
})

describe('deviceDetector', () => {
  beforeEach(() => {
    mockNavigator.userAgent = ''
  })

  describe('detect', () => {
    it('should detect mobile device correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'

      const result = DeviceDetector.detect()

      expect(result.isMobile).toBe(true)
      expect(result.isIOS).toBe(true)
      expect(result.isAndroid).toBe(false)

      expect(result.rawUA).toBe(mockNavigator.userAgent)
    })

    it('should detect Android device correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; Android 10; SM-G975F) SamsungBrowser/12.0'

      const result = DeviceDetector.detect()

      expect(result.isMobile).toBe(true)
      expect(result.isAndroid).toBe(true)
      expect(result.isIOS).toBe(false)
    })

    it('should detect desktop device correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124'

      const result = DeviceDetector.detect()

      expect(result.isMobile).toBe(false)
      expect(result.isAndroid).toBe(false)
      expect(result.isIOS).toBe(false)
    })

    it('should detect macOS correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

      const result = DeviceDetector.detect()

      expect(result.isMacOS).toBe(true)
      expect(result.isMobile).toBe(false)
    })

    it('should detect HarmonyOS correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Linux; HarmonyOS 2.0.0; NOH-AL10) HuaweiBrowser/12.0'

      const result = DeviceDetector.detect()

      expect(result.isHarmonyOS).toBe(true)
      expect(result.isMobile).toBe(false) // HarmonyOS is not detected as mobile by the current regex
    })

    it('should detect WeChat correctly', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.0'

      const result = DeviceDetector.detect()

      expect(result.isWechat).toBe(true)
      expect(result.isIOS).toBe(true)
    })

    it('should handle empty user agent', () => {
      mockNavigator.userAgent = ''

      const result = DeviceDetector.detect()

      expect(result.isMobile).toBe(false)
      expect(result.isAndroid).toBe(false)
      expect(result.isIOS).toBe(false)
      expect(result.isMacOS).toBe(false)
      expect(result.isHarmonyOS).toBe(false)
      expect(result.isWechat).toBe(false)
      expect(result.rawUA).toBe('')
    })

    it('should handle undefined navigator', () => {
      // @ts-expect-error - Testing undefined navigator scenario
      delete globalThis.navigator

      const result = DeviceDetector.detect()

      expect(result.rawUA).toBe('')
      expect(result.isMobile).toBe(false)
    })
  })
})
