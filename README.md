# App Luancher

一个用于在浏览器中唤起移动端App的NPM包，支持多种平台和智能策略。

[![](https://img.shields.io/badge/Author-BluesYoung--web-blue)](https://gitee.com/BluesYoung-web)

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)


## ✨ 特性

- 🚀 **多种唤起方式** - 支持 Scheme 唤起、Universal Link、App Link
- 🔗 **链式调用** - 流畅的 API 设计，易于配置
- 🔌 **插件系统** - 支持自定义插件扩展
- 📱 **设备检测** - 自动检测设备类型和浏览器环境
- 🎯 **智能回退** - 唤起失败时自动跳转到回退页面
- 📋 **剪切板支持** - 支持唤起前写入剪切板内容
- 🐛 **调试模式** - 详细的日志输出，便于调试
- 📦 **TypeScript** - 完整的类型支持

## 📦 安装

```bash
npm install @bluesyoung/app-launcher
# 或
yarn add @bluesyoung/app-launcher
# 或
pnpm add @bluesyoung/app-launcher
```

## 🚀 快速开始

### 基础用法

```typescript
import { AppLauncher } from '@bluesyoung/app-launcher'

// 传统方式
const launcher = new AppLauncher({
  scheme: 'myapp://open',
  fallbackUrl: 'https://example.com/download',
  timeout: 3000,
  debug: true
})

await launcher.launch()
```

### 链式调用（推荐）

```typescript
import { AppLauncher } from '@bluesyoung/app-launcher'

// 链式调用方式
const result = await AppLauncher.create()
  .scheme('myapp://open')
  .fallbackUrl('https://example.com/download')
  .timeout(3000)
  .debug(true)
  .onStart(() => console.log('开始唤起'))
  .onSuccess(() => console.log('唤起成功'))
  .onFail(error => console.error('唤起失败:', error))
  .launch()
```

## 📖 API 文档

### AppLauncher.create()

创建链式调用构建器。

```typescript
const builder = AppLauncher.create()
```

### 链式调用方法

#### scheme(scheme: string)

设置唤起 Scheme。

```typescript
.scheme('myapp://open')           // 自定义 Scheme
.scheme('https://myapp.com/open') // Universal Link
```

#### fallbackUrl(url: string)

设置唤起失败时的回退 URL。

```typescript
.fallbackUrl('https://example.com/download')
```

#### clipboardText(text: string)

设置需要写入剪切板的内容。

```typescript
.clipboardText('分享的内容')
```

#### timeout(ms: number)

设置唤起超时时间（毫秒）。

```typescript
.timeout(5000) // 5秒超时
```

#### debug(enabled: boolean)

启用或禁用调试模式。

```typescript
.debug(true) // 启用调试模式，会输出详细日志
```

#### 回调函数

```typescript
.onStart(() => {
  console.log('开始唤起应用')
  // 可以在这里添加埋点统计
})

.onSuccess(() => {
  console.log('应用唤起成功')
  // 可以在这里添加成功统计
})

.onFail((error) => {
  console.error('应用唤起失败:', error)
  // 可以在这里添加失败统计
})
```

#### 插件管理

```typescript
// 添加单个插件
.addPlugin(new CustomPlugin())

// 添加多个插件
.addPlugins([new CustomPlugin(), new AnotherPlugin()])
```

### 执行方法

#### build()

构建并返回 AppLauncher 实例。

```typescript
const launcher = AppLauncher.create()
  .scheme('myapp://open')
  .build()

await launcher.launch()
```

#### launch()

构建并立即执行唤起。

```typescript
const result = await AppLauncher.create()
  .scheme('myapp://open')
  .launch()
```

## 🔌 插件系统

### 内置插件

- **DefaultPlugin** - 默认唤起插件，支持常规浏览器环境，包含全屏加载动画
- **WechatPlugin** - 微信内唤起插件，引导用户在外部浏览器打开
- **DingTalkPlugin** - 钉钉内唤起插件，引导用户在外部浏览器打开

### 自定义插件

```typescript
import { AppLaunchPlugin } from '@bluesyoung/app-launcher'

class CustomPlugin implements AppLaunchPlugin {
  name = 'custom'
  priority = 0

  supported(deviceInfo: DeviceInfo): boolean {
    // 定义插件支持的设备条件
    return deviceInfo.isAndroid
  }

  async launch(options: LaunchOptions, deviceInfo: DeviceInfo): Promise<boolean> {
    // 实现自定义唤起逻辑
    console.log('使用自定义插件唤起')

    // 返回是否唤起成功
    return true
  }
}

// 使用自定义插件
const launcher = AppLauncher.create()
  .scheme('myapp://open')
  .addPlugin(new CustomPlugin())
  .build()
```

## 📱 设备检测

库会自动检测以下设备信息：

```typescript
interface DeviceInfo {
  isMobile: boolean // 是否为手机
  isAndroid: boolean // 是否为安卓
  isIOS: boolean // 是否为 iOS
  isMacOS: boolean // 是否为 macOS
  isHarmonyOS: boolean // 是否为鸿蒙
  isWechat: boolean // 是否为微信
  rawUA: string // 原始 User Agent
}
```

## 🎯 使用场景

### 1. 应用下载页面

```typescript
// 在应用下载页面，尝试唤起已安装的应用
AppLauncher.create()
  .scheme('myapp://open?page=home')
  .fallbackUrl('/download') // 如果唤起失败，跳转到下载页面
  .launch()
```

### 2. 分享功能

```typescript
// 分享内容到应用
AppLauncher.create()
  .scheme('myapp://share')
  .clipboardText('分享的内容') // 将内容写入剪切板
  .onSuccess(() => {
    // 唤起成功，可以隐藏分享按钮
  })
  .onFail(() => {
    // 唤起失败，显示下载提示
  })
  .launch()
```

### 3. 深度链接

```typescript
// 从网页跳转到应用的特定页面
AppLauncher.create()
  .scheme('myapp://product/123')
  .fallbackUrl('/product/123') // 如果应用未安装，跳转到网页版
  .launch()
```

## 🔧 高级配置

### 复杂配置示例

```typescript
const launcher = AppLauncher.create()
  .scheme('https://myapp.com/open')
  .fallbackUrl('https://example.com/download')
  .clipboardText('分享的内容')
  .timeout(3000)
  .debug(true)
  .onStart(() => {
    console.log('开始唤起应用')
    // 显示加载状态
    showLoading()
  })
  .onSuccess(() => {
    console.log('应用唤起成功')
    // 隐藏加载状态
    hideLoading()
    // 发送成功统计
    analytics.track('app_launch_success')
  })
  .onFail((error) => {
    console.error('应用唤起失败:', error)
    // 隐藏加载状态
    hideLoading()
    // 显示下载提示
    showDownloadTip()
    // 发送失败统计
    analytics.track('app_launch_failed', { error: error.message })
  })
  .build()

// 执行唤起
const result = await launcher.launch()
console.log('唤起结果:', result)
```

## 📊 唤起结果

```typescript
interface LaunchResult {
  success: boolean // 是否成功
  error?: Error // 错误信息
  timestamp: number // 时间戳
  deviceInfo: DeviceInfo // 设备信息
}
```

## 🐛 调试

启用调试模式可以查看详细的唤起过程：

```typescript
AppLauncher.create()
  .scheme('myapp://open')
  .debug(true) // 启用调试模式
  .launch()
```

调试模式下会输出：
- 设备检测结果
- 插件匹配情况
- 唤起过程日志
- 成功/失败状态

## 🛠️ 开发

### 构建

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 开发模式
pnpm run dev

# 运行测试
pnpm run test

# 代码检查
pnpm run lint
```

### 项目结构

```
src/
├── core/           # 核心功能
│   ├── AppLauncher.ts
│   └── PluginManager.ts
├── plugins/         # 内置插件
│   └── index.ts
├── utils/          # 工具函数
│   ├── clipboard.ts
│   ├── device.ts
│   └── logger.ts
├── types.d.ts      # 类型定义
└── index.ts        # 入口文件
```

### 技术栈

- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **ESLint** - 代码检查
- **Vitest** - 测试框架

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请提交 Issue 或联系维护者。
