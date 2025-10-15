/*
 * @Author: zhangyang
 * @Date: 2025-09-19 11:25:19
 * @LastEditTime: 2025-09-19 14:39:12
 * @Description: 剪切板工具类
 */
/**
 * 剪切板工具类
 * 实现了平台特定的剪切板策略和智能降级
 */
export class ClipboardUtils {
  /**
   * 复制文本到剪切板（增强版本）
   * @param text 要复制的文本
   * @param deviceInfo 设备信息
   * @param next 下一步操作
   * @returns 是否成功复制
   */
  static async copyText(text: string, deviceInfo: DeviceInfo, next: () => void) {
    if (deviceInfo.isIOS || deviceInfo.isMacOS) {
      // !!! 苹果设备使用标准的 clipboardApi
      await this.copyWithModernAPI(text)
    }
    else {
      // !!! 其他设备，特别是 华为鸿蒙，需要同步操作，否则不会执行后续的 next 函数
      this.copyWithLegacyMethod(text)
    }

    next()
  }

  /**
   * 检查现代API是否可用
   * @returns 是否可用
   */
  static isModernAPIAvailable(): boolean {
    return !!(
      navigator.clipboard
      && window.isSecureContext
      && typeof navigator.clipboard.writeText === 'function'
    )
  }

  /**
   * 检查平台是否支持剪切板操作
   * @param platform 平台名称
   * @returns 是否支持
   */
  static isPlatformSupported(platform: string): boolean {
    // 某些平台限制剪切板操作
    const restrictedPlatforms = ['douyin', 'xiaohongshu', 'kuaishou']
    return !restrictedPlatforms.includes(platform)
  }

  /**
   * 使用现代API复制文本
   * @param text 要复制的文本
   * @returns 是否成功复制
   */
  private static async copyWithModernAPI(text: string): Promise<boolean> {
    if (!this.isModernAPIAvailable()) {
      throw new Error('Modern clipboard API not available')
    }

    const copyPromise = navigator.clipboard.writeText(text)

    await copyPromise

    return true
  }

  /**
   * 使用传统方法复制文本
   * @param text 要复制的文本
   * @returns 是否成功复制
   */
  private static copyWithLegacyMethod(text: string): boolean {
    const textArea = document.createElement('textarea')
    textArea.value = text

    // 设置样式使其不可见但可选中
    Object.assign(textArea.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '2em',
      height: '2em',
      padding: '0',
      border: 'none',
      outline: 'none',
      boxShadow: 'none',
      background: 'transparent',
      opacity: '0',
      pointerEvents: 'none',
    })

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, text.length) // 移动端兼容

    try {
      const successful = document.execCommand('copy')
      return successful
    }
    catch (error) {
      console.warn('Legacy clipboard copy failed:', error)
      return false
    }
    finally {
      document.body.removeChild(textArea)
    }
  }
}
