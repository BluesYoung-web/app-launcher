/*
 * @Author: zhangyang
 * @Date: 2025-09-19 12:23:52
 * @LastEditTime: 2025-09-19 12:23:53
 * @Description:
 */
export class PluginManager implements PluginRegistry {
  private plugins: Map<string, AppLaunchPlugin> = new Map()

  registerPlugin(plugin: AppLaunchPlugin): void {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} already registered, replacing existing plugin`)
    }
    this.plugins.set(plugin.name, plugin)
  }

  unregisterPlugin(pluginName: string): void {
    this.plugins.delete(pluginName)
  }

  getPlugins(): AppLaunchPlugin[] {
    return Array.from(this.plugins.values())
  }

  clearPlugins(): void {
    this.plugins.clear()
  }

  getPlugin(name: string): AppLaunchPlugin | undefined {
    return this.plugins.get(name)
  }

  hasPlugin(name: string): boolean {
    return this.plugins.has(name)
  }

  // 根据设备信息筛选支持的插件
  getSupportedPlugins(deviceInfo: any): AppLaunchPlugin[] {
    return this.getPlugins().filter(plugin => plugin.supported(deviceInfo))
  }

  // 批量注册插件
  registerPlugins(plugins: AppLaunchPlugin[]): void {
    plugins.forEach(plugin => this.registerPlugin(plugin))
  }
}

// 全局插件管理器实例
export const globalPluginManager = new PluginManager()
