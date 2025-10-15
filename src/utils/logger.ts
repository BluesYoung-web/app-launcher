/* eslint-disable no-console */
/*
 * @Author: zhangyang
 * @Date: 2025-09-19 11:12:03
 * @LastEditTime: 2025-09-19 14:38:38
 * @Description: 调试日志工具类
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerConfig {
  enabled: boolean
  level: LogLevel
  prefix: string
  timestamp: boolean
}

/**
 * 调试日志器
 */
export class Logger {
  private config: LoggerConfig
  private static instance: Logger | null = null

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      enabled: true,
      level: 'debug',
      prefix: '[AppLauncher]',
      timestamp: true,
      ...config,
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config)
    }
    else if (config) {
      Logger.instance.updateConfig(config)
    }
    return Logger.instance
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 获取当前配置
   */
  getConfig(): LoggerConfig {
    return { ...this.config }
  }

  /**
   * 检查日志级别是否应该输出
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) {
      return false
    }

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(this.config.level)
    const messageLevelIndex = levels.indexOf(level)

    return messageLevelIndex >= currentLevelIndex
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: LogLevel, message: string, data?: any): any[] {
    const parts: any[] = []

    // 添加时间戳
    if (this.config.timestamp) {
      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5)
      parts.push(`[${timestamp}]`)
    }

    // 添加前缀
    parts.push(this.config.prefix)

    // 添加级别
    parts.push(`[${level.toUpperCase()}]`)

    // 添加消息
    parts.push(message)

    // 如果有数据，添加到末尾
    if (data !== undefined) {
      parts.push(data)
    }

    return parts
  }

  /**
   * 调试日志
   */
  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      const formatted = this.formatMessage('debug', message, data)
      console.log(...formatted)
    }
  }

  /**
   * 信息日志
   */
  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      const formatted = this.formatMessage('info', message, data)
      console.info(...formatted)
    }
  }

  /**
   * 警告日志
   */
  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      const formatted = this.formatMessage('warn', message, data)
      console.warn(...formatted)
    }
  }

  /**
   * 错误日志
   */
  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      const formatted = this.formatMessage('error', message, data)
      console.error(...formatted)
    }
  }

  /**
   * 分组开始
   */
  group(label: string, collapsed = false): void {
    if (this.config.enabled) {
      const formatted = this.formatMessage('info', label)
      if (collapsed) {
        console.groupCollapsed(...formatted)
      }
      else {
        console.group(...formatted)
      }
    }
  }

  /**
   * 分组结束
   */
  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd()
    }
  }

  /**
   * 计时开始
   */
  time(label: string): void {
    if (this.config.enabled) {
      console.time(`${this.config.prefix} ${label}`)
    }
  }

  /**
   * 计时结束
   */
  timeEnd(label: string): void {
    if (this.config.enabled) {
      console.timeEnd(`${this.config.prefix} ${label}`)
    }
  }

  /**
   * 表格输出
   */
  table(data: any): void {
    if (this.config.enabled && this.shouldLog('debug')) {
      console.table(data)
    }
  }

  /**
   * 创建子日志器
   */
  createChild(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix}:${prefix}`,
    })
  }
}

/**
 * 默认日志器实例
 */
export const logger = Logger.getInstance()

/**
 * 创建模块日志器的便捷函数
 */
export function createLogger(module: string, config?: Partial<LoggerConfig>): Logger {
  return Logger.getInstance(config).createChild(module)
}
