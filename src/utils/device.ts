/*
 * @Author: zhangyang
 * @Date: 2025-09-19 11:09:20
 * @LastEditTime: 2025-10-16 16:21:01
 * @Description:
 */
export class DeviceDetector {
  static detect(): DeviceInfo {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''

    return {
      isMobile: this.isMobile(ua),
      isAndroid: this.isAndroid(ua),
      isIOS: this.isIOS(ua),
      isMacOS: this.isMacOS(ua),
      isHarmonyOS: this.isHarmonyOS(ua),
      isWechat: this.isWechat(ua),

      rawUA: ua,
    }
  }

  private static isMobile(ua: string): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  }

  private static isAndroid(ua: string): boolean {
    return /Android/i.test(ua)
  }

  private static isIOS(ua: string): boolean {
    return /iPhone|iPad|iPod/i.test(ua)
  }

  private static isMacOS(ua: string): boolean {
    return /Mac OS X/i.test(ua)
  }

  private static isHarmonyOS(ua: string): boolean {
    return /HarmonyOS/i.test(ua)
  }

  private static isWechat(ua: string): boolean {
    return /MicroMessenger/i.test(ua)
  }
}
