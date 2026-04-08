/*
 * @Author: zhangyang
 * @Date: 2025-09-19 11:09:20
 * @LastEditTime: 2026-04-08 10:02:36
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
      isPureHarmonyOS: this.isPureHarmonyOS(ua),
      isWechat: this.isWechat(ua),

      rawUA: ua,
    }
  }

  private static isMobile(ua: string): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Phone/i.test(ua)
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
    return /HarmonyOS|OpenHarmony/i.test(ua)
  }

  private static isPureHarmonyOS(ua: string): boolean {
    return this.isHarmonyOS(ua) && !this.isAndroid(ua)
  }

  private static isWechat(ua: string): boolean {
    return /MicroMessenger/i.test(ua)
  }
}
