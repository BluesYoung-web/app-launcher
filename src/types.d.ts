/*
 * @Author: zhangyang
 * @Date: 2025-09-19 10:56:45
 * @LastEditTime: 2025-10-16 16:21:13
 * @Description:
 */
/**
 * 可扩展插件
 */
interface AppLaunchPlugin {
  /**
   * 插件名称
   */
  name: string
  /**
   * 插件匹配条件
   */
  supported: (deviceInfo: DeviceInfo) => boolean
  /**
   * 唤起App
   * @param options 唤起参数
   * @param deviceInfo 设备信息
   * @returns 是否唤起成功
   */
  launch: (options: LaunchOptions, deviceInfo: DeviceInfo) => Promise<boolean>

  /**
   * 插件优先级
   * 当同时匹配多个插件时，执行优先级最高的
   */
  priority: number
}

/**
 * 唤起参数(初始化配置)
 */
interface LaunchOptions {
  /**
   * 唤起Scheme
   * @cond1 com.xxx.yyy://
   * @cond2 universalLink | app link
   */
  scheme: string
  /**
   * 唤起失败时跳转的页面
   */
  fallbackUrl?: string
  /**
   * 需要写入剪切板的内容
   */
  clipboardText?: string

  /**
   * 唤起超时时间
   * @default 3000
   */
  timeout?: number
  /**
   * 是否开启调试模式(查看各个过程的详细日志)
   */
  debug?: boolean
  /**
   * 开始唤起
   */
  onStart?: () => void
  /**
   * 唤起成功时的回调
   */
  onSuccess?: () => void
  /**
   * 唤起失败时的回调
   */
  onFail?: (error: Error) => void
  /**
   * 自定义插件
   */
  plugins?: AppLaunchPlugin[]
}

/**
 * 插件注册表
 */
interface PluginRegistry {
  /**
   * 注册插件
   * @param plugin
   */
  registerPlugin: (plugin: AppLaunchPlugin) => void
  /**
   * 注销插件
   * @param pluginName 插件名称
   */
  unregisterPlugin: (pluginName: string) => void
  /**
   * 获取所有插件
   */
  getPlugins: () => AppLaunchPlugin[]
  /**
   * 清除所有插件
   */
  clearPlugins: () => void
  /**
   * 获取插件
   * @param name 插件名称
   */
  getPlugin: (name: string) => AppLaunchPlugin | undefined
  /**
   * 是否存在插件
   */
  hasPlugin: (name: string) => boolean
  /**
   * 获取支持的插件
   * @param deviceInfo 设备信息
   */
  getSupportedPlugins: (deviceInfo: DeviceInfo) => AppLaunchPlugin[]
}

/**
 * 设备信息
 */
interface DeviceInfo {
  /**
   * 是否为手机
   */
  isMobile: boolean
  /**
   * 是否为安卓
   */
  isAndroid: boolean
  /**
   * 是否为IOS
   */
  isIOS: boolean
  /**
   * 是否为MacOS
   */
  isMacOS: boolean
  /**
   * 是否为鸿蒙
   */
  isHarmonyOS: boolean
  /**
   * 是否为微信
   */
  isWechat: boolean
  /**
   * 原始UA
   */
  rawUA: string
}

/**
 * 唤起结果
 */
interface LaunchResult {
  /**
   * 是否成功
   */
  success: boolean
  /**
   * 错误信息
   */
  error?: Error
  /**
   * 时间戳
   */
  timestamp: number
  /**
   * 设备信息
   */
  deviceInfo: DeviceInfo
}
