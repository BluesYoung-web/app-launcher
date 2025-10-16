import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PluginManager } from '../core/PluginManager'

describe('pluginManager', () => {
  let pluginManager: PluginManager

  const mockPlugin1 = {
    name: 'plugin1',
    priority: 1,
    supported: vi.fn(() => true),
    launch: vi.fn(() => Promise.resolve(true)),
  }

  const mockPlugin2 = {
    name: 'plugin2',
    priority: 2,
    supported: vi.fn(() => false),
    launch: vi.fn(() => Promise.resolve(false)),
  }

  const mockPlugin3 = {
    name: 'plugin3',
    priority: 3,
    supported: vi.fn(() => true),
    launch: vi.fn(() => Promise.resolve(true)),
  }

  const mockDeviceInfo = {
    isMobile: true,
    isAndroid: true,
    isIOS: false,
    isMacOS: false,
    isHarmonyOS: false,
    isWechat: false,
    rawUA: 'test-ua',
  }

  beforeEach(() => {
    pluginManager = new PluginManager()
    vi.clearAllMocks()
  })

  describe('registerPlugin', () => {
    it('should register a plugin successfully', () => {
      pluginManager.registerPlugin(mockPlugin1)

      expect(pluginManager.hasPlugin('plugin1')).toBe(true)
      expect(pluginManager.getPlugin('plugin1')).toEqual(mockPlugin1)
    })

    it('should replace existing plugin when registering duplicate', () => {
      pluginManager.registerPlugin(mockPlugin1)
      pluginManager.registerPlugin({ ...mockPlugin1, priority: 5 })

      const plugins = pluginManager.getPlugins()
      const plugin1Instances = plugins.filter(p => p.name === 'plugin1')

      expect(plugin1Instances).toHaveLength(1)
      expect(plugin1Instances[0].priority).toBe(5) // New priority
    })

    it('should register multiple different plugins', () => {
      pluginManager.registerPlugin(mockPlugin1)
      pluginManager.registerPlugin(mockPlugin2)
      pluginManager.registerPlugin(mockPlugin3)

      expect(pluginManager.getPlugins()).toHaveLength(3)
      expect(pluginManager.hasPlugin('plugin1')).toBe(true)
      expect(pluginManager.hasPlugin('plugin2')).toBe(true)
      expect(pluginManager.hasPlugin('plugin3')).toBe(true)
    })
  })

  describe('unregisterPlugin', () => {
    it('should unregister a plugin successfully', () => {
      pluginManager.registerPlugin(mockPlugin1)
      expect(pluginManager.hasPlugin('plugin1')).toBe(true)

      pluginManager.unregisterPlugin('plugin1')
      expect(pluginManager.hasPlugin('plugin1')).toBe(false)
    })

    it('should handle unregistering non-existent plugin', () => {
      expect(() => {
        pluginManager.unregisterPlugin('non-existent')
      }).not.toThrow()
    })
  })

  describe('getSupportedPlugins', () => {
    it('should return only supported plugins', () => {
      pluginManager.registerPlugin(mockPlugin1) // supported: true
      pluginManager.registerPlugin(mockPlugin2) // supported: false
      pluginManager.registerPlugin(mockPlugin3) // supported: true

      const supportedPlugins = pluginManager.getSupportedPlugins(mockDeviceInfo)

      expect(supportedPlugins).toHaveLength(2)
      expect(supportedPlugins.map(p => p.name)).toContain('plugin1')
      expect(supportedPlugins.map(p => p.name)).toContain('plugin3')
      expect(supportedPlugins.map(p => p.name)).not.toContain('plugin2')
    })

    it('should return supported plugins in registration order', () => {
      pluginManager.registerPlugin(mockPlugin1) // priority: 1
      pluginManager.registerPlugin(mockPlugin3) // priority: 3
      pluginManager.registerPlugin(mockPlugin2) // priority: 2, but not supported

      const supportedPlugins = pluginManager.getSupportedPlugins(mockDeviceInfo)

      expect(supportedPlugins).toHaveLength(2)
      expect(supportedPlugins[0].name).toBe('plugin1') // First registered
      expect(supportedPlugins[1].name).toBe('plugin3') // Second registered
    })

    it('should return empty array when no plugins are supported', () => {
      pluginManager.registerPlugin(mockPlugin2) // supported: false

      const supportedPlugins = pluginManager.getSupportedPlugins(mockDeviceInfo)

      expect(supportedPlugins).toHaveLength(0)
    })
  })

  describe('getPlugins', () => {
    it('should return all registered plugins', () => {
      pluginManager.registerPlugin(mockPlugin1)
      pluginManager.registerPlugin(mockPlugin2)

      const plugins = pluginManager.getPlugins()

      expect(plugins).toHaveLength(2)
      expect(plugins.map(p => p.name)).toContain('plugin1')
      expect(plugins.map(p => p.name)).toContain('plugin2')
    })

    it('should return empty array when no plugins registered', () => {
      const plugins = pluginManager.getPlugins()
      expect(plugins).toHaveLength(0)
    })
  })

  describe('clearPlugins', () => {
    it('should clear all plugins', () => {
      pluginManager.registerPlugin(mockPlugin1)
      pluginManager.registerPlugin(mockPlugin2)

      expect(pluginManager.getPlugins()).toHaveLength(2)

      pluginManager.clearPlugins()

      expect(pluginManager.getPlugins()).toHaveLength(0)
      expect(pluginManager.hasPlugin('plugin1')).toBe(false)
      expect(pluginManager.hasPlugin('plugin2')).toBe(false)
    })
  })

  describe('getPlugin', () => {
    it('should return plugin by name', () => {
      pluginManager.registerPlugin(mockPlugin1)

      const plugin = pluginManager.getPlugin('plugin1')

      expect(plugin).toEqual(mockPlugin1)
    })

    it('should return undefined for non-existent plugin', () => {
      const plugin = pluginManager.getPlugin('non-existent')

      expect(plugin).toBeUndefined()
    })
  })

  describe('hasPlugin', () => {
    it('should return true for existing plugin', () => {
      pluginManager.registerPlugin(mockPlugin1)

      expect(pluginManager.hasPlugin('plugin1')).toBe(true)
    })

    it('should return false for non-existent plugin', () => {
      expect(pluginManager.hasPlugin('non-existent')).toBe(false)
    })
  })

  describe('plugin registration order', () => {
    it('should maintain plugin order by registration when getting supported plugins', () => {
      const lowPriorityPlugin = { ...mockPlugin1, name: 'low', priority: 1 }
      const highPriorityPlugin = { ...mockPlugin3, name: 'high', priority: 10 }
      const mediumPriorityPlugin = { ...mockPlugin1, name: 'medium', priority: 5 }

      pluginManager.registerPlugin(lowPriorityPlugin)
      pluginManager.registerPlugin(highPriorityPlugin)
      pluginManager.registerPlugin(mediumPriorityPlugin)

      const supportedPlugins = pluginManager.getSupportedPlugins(mockDeviceInfo)

      expect(supportedPlugins).toHaveLength(3)
      expect(supportedPlugins[0].name).toBe('low') // First registered
      expect(supportedPlugins[1].name).toBe('high') // Second registered
      expect(supportedPlugins[2].name).toBe('medium') // Third registered
    })
  })
})
