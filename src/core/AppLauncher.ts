/*
 * @Author: zhangyang
 * @Date: 2025-09-19 12:24:41
 * @LastEditTime: 2025-09-19 15:55:47
 * @Description:
 */
import type { Logger } from '@/utils/logger'
import defu from 'defu'
import { createLogger } from '@/utils/logger'
import { DefaultPlugin, DingTalkPlugin, WechatPlugin } from '../plugins'
import { DeviceDetector } from '../utils/device'
import { PluginManager } from './PluginManager'

/**
 * 链式调用构建器接口
 */
export interface AppLauncherBuilder {
  /**
   * 设置唤起Scheme
   */
  scheme: (scheme: string) => AppLauncherBuilder

  /**
   * 设置失败时的回退URL
   */
  fallbackUrl: (url: string) => AppLauncherBuilder

  /**
   * 设置剪切板内容
   */
  clipboardText: (text: string) => AppLauncherBuilder

  /**
   * 设置超时时间
   */
  timeout: (ms: number) => AppLauncherBuilder

  /**
   * 启用/禁用调试模式
   */
  debug: (enabled: boolean) => AppLauncherBuilder

  /**
   * 设置开始唤起回调
   */
  onStart: (callback: () => void) => AppLauncherBuilder

  /**
   * 设置成功回调
   */
  onSuccess: (callback: () => void) => AppLauncherBuilder

  /**
   * 设置失败回调
   */
  onFail: (callback: (error: Error) => void) => AppLauncherBuilder

  /**
   * 添加自定义插件
   */
  addPlugin: (plugin: AppLaunchPlugin) => AppLauncherBuilder

  /**
   * 添加多个自定义插件
   */
  addPlugins: (plugins: AppLaunchPlugin[]) => AppLauncherBuilder

  /**
   * 构建并返回 AppLauncher 实例
   */
  build: () => AppLauncher

  /**
   * 构建并立即执行唤起
   */
  launch: () => Promise<LaunchResult>
}

export class AppLauncher {
  private options: LaunchOptions
  private deviceInfo: DeviceInfo
  private plugins: AppLaunchPlugin[]

  private logger: Logger

  constructor(options: LaunchOptions) {
    this.options = defu(options, {
      timeout: 3000,
      debug: false,
    })

    this.deviceInfo = DeviceDetector.detect()
    this.plugins = this.initializePlugins(this.options)

    this.logger = createLogger('AppLauncher', { enabled: this.options.debug })
    this.logger.debug('plugins initialized', { plugins: this.plugins })
  }

  /**
   * 创建链式调用构建器
   */
  static create(): AppLauncherBuilder {
    return new AppLauncherBuilderImpl()
  }

  private initializePlugins(options: LaunchOptions): AppLaunchPlugin[] {
    const pluginManager = new PluginManager()

    // 注册内置插件
    const builtinPlugins = [
      new DefaultPlugin(),
      new WechatPlugin(),
      new DingTalkPlugin(),
    ]

    builtinPlugins.forEach(plugin => pluginManager.registerPlugin(plugin))

    // 注册用户自定义插件
    if (options.plugins && options.plugins.length > 0) {
      options.plugins.forEach(plugin => pluginManager.registerPlugin(plugin))
    }

    // 返回支持的插件列表
    return pluginManager.getSupportedPlugins(this.deviceInfo)
  }

  async launch(): Promise<LaunchResult> {
    try {
      const result = await this.attemptLaunch()

      if (!result.success) {
        location.href = this.options.fallbackUrl || '/'
      }

      return {
        success: result.success,
        error: result.error,
        timestamp: Date.now(),
        deviceInfo: this.deviceInfo,
      }
    }
    catch (error) {
      this.logger.warn('唤起过程中抛出错误，不进行后续操作')

      return {
        success: false,
        error: (error as Error),
        timestamp: Date.now(),
        deviceInfo: this.deviceInfo,
      }
    }
  }

  private async attemptLaunch(): Promise<{ success: boolean, error?: Error }> {
    this.logger.debug('开始尝试唤起', { pluginCount: this.plugins.length })

    const allMatchedPlugins = this.plugins.filter(plugin => plugin.supported(this.deviceInfo))
    allMatchedPlugins.sort((a, b) => b.priority - a.priority)
    const matchedPlugin = allMatchedPlugins[0]

    if (matchedPlugin) {
      this.logger.debug('执行插件', {
        plugin: matchedPlugin.name,
        supported: true,
        deviceInfo: this.deviceInfo,
      })

      this.options.onStart?.()

      const isSuccess = await matchedPlugin.launch(this.options, this.deviceInfo)
      if (isSuccess) {
        this.logger.debug('插件唤起成功', { plugin: matchedPlugin.name })
        this.options.onSuccess?.()
        return { success: true }
      }
      else {
        this.logger.error('插件唤起失败', { plugin: matchedPlugin.name })
        this.options.onFail?.(new Error('唤起失败'))
        return { success: false, error: new Error('唤起失败') }
      }
    }

    return { success: false, error: new Error('没有找到匹配的插件') }
  }
}

/**
 * 链式调用构建器实现类
 */
class AppLauncherBuilderImpl implements AppLauncherBuilder {
  private options: Partial<LaunchOptions> = {}
  private customPlugins: AppLaunchPlugin[] = []

  scheme = (scheme: string): AppLauncherBuilder => {
    this.options.scheme = scheme
    return this
  }

  fallbackUrl = (url: string): AppLauncherBuilder => {
    this.options.fallbackUrl = url
    return this
  }

  clipboardText = (text: string): AppLauncherBuilder => {
    this.options.clipboardText = text
    return this
  }

  timeout = (ms: number): AppLauncherBuilder => {
    this.options.timeout = ms
    return this
  }

  debug = (enabled: boolean): AppLauncherBuilder => {
    this.options.debug = enabled
    return this
  }

  onStart = (callback: () => void): AppLauncherBuilder => {
    this.options.onStart = callback
    return this
  }

  onSuccess = (callback: () => void): AppLauncherBuilder => {
    this.options.onSuccess = callback
    return this
  }

  onFail = (callback: (error: Error) => void): AppLauncherBuilder => {
    this.options.onFail = callback
    return this
  }

  addPlugin = (plugin: AppLaunchPlugin): AppLauncherBuilder => {
    this.customPlugins.push(plugin)
    return this
  }

  addPlugins = (plugins: AppLaunchPlugin[]): AppLauncherBuilder => {
    this.customPlugins.push(...plugins)
    return this
  }

  build = (): AppLauncher => {
    // 合并自定义插件到选项中
    if (this.customPlugins.length > 0) {
      this.options.plugins = this.customPlugins
    }

    return new AppLauncher(this.options as LaunchOptions)
  }

  launch = async (): Promise<LaunchResult> => {
    return this.build().launch()
  }
}
