/*
 * @Author: zhangyang
 * @Date: 2025-09-19 11:10:36
 * @LastEditTime: 2025-09-19 16:22:54
 * @Description:
 */
import { ClipboardUtils } from '@/utils/clipboard'
import { createLogger } from '@/utils/logger'

export class DefaultPlugin implements AppLaunchPlugin {
  name = 'default'
  priority = 0

  /**
   * 是否匹配此插件
   * @param deviceInfo 设备信息
   */
  supported(deviceInfo: DeviceInfo): boolean {
    return !deviceInfo.isWechat
  }

  /**
   * 展示全屏 loading
   */
  showFullScreenLoading() {
    const div = document.createElement('div')
    div.id = 'app-launcher-full-screen-loading'
    div.setAttribute('style', 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; z-index: 9999; background-color: rgba(0,0,0,0.2)')
    div.onclick = () => this.hideFullScreenLoading()
    div.innerHTML = `
      <style>
      /* From Uiverse.io by SangeethSujith */ 
.banter-loader {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 72px;
  height: 72px;
  margin-left: -36px;
  margin-top: -36px;
}

.banter-loader__box {
  float: left;
  position: relative;
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.banter-loader__box:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #1e90ff;
  border-radius: 7px;
}

.banter-loader__box:nth-child(3n) {
  margin-right: 0;
  margin-bottom: 6px;
}

.banter-loader__box:nth-child(1):before,
.banter-loader__box:nth-child(4):before {
  margin-left: 26px;
}

.banter-loader__box:nth-child(3):before {
  margin-top: 52px;
}

.banter-loader__box:last-child {
  margin-bottom: 0;
}

@keyframes moveBox-1 {
  9.0909090909% {
    transform: translate(-26px, 0);
  }

  18.1818181818% {
    transform: translate(0px, 0);
  }

  27.2727272727% {
    transform: translate(0px, 0);
  }

  36.3636363636% {
    transform: translate(26px, 0);
  }

  45.4545454545% {
    transform: translate(26px, 26px);
  }

  54.5454545455% {
    transform: translate(26px, 26px);
  }

  63.6363636364% {
    transform: translate(26px, 26px);
  }

  72.7272727273% {
    transform: translate(26px, 0px);
  }

  81.8181818182% {
    transform: translate(0px, 0px);
  }

  90.9090909091% {
    transform: translate(-26px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(1) {
  animation: moveBox-1 4s infinite;
}

@keyframes moveBox-2 {
  9.0909090909% {
    transform: translate(0, 0);
  }

  18.1818181818% {
    transform: translate(26px, 0);
  }

  27.2727272727% {
    transform: translate(0px, 0);
  }

  36.3636363636% {
    transform: translate(26px, 0);
  }

  45.4545454545% {
    transform: translate(26px, 26px);
  }

  54.5454545455% {
    transform: translate(26px, 26px);
  }

  63.6363636364% {
    transform: translate(26px, 26px);
  }

  72.7272727273% {
    transform: translate(26px, 26px);
  }

  81.8181818182% {
    transform: translate(0px, 26px);
  }

  90.9090909091% {
    transform: translate(0px, 26px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(2) {
  animation: moveBox-2 4s infinite;
}

@keyframes moveBox-3 {
  9.0909090909% {
    transform: translate(-26px, 0);
  }

  18.1818181818% {
    transform: translate(-26px, 0);
  }

  27.2727272727% {
    transform: translate(0px, 0);
  }

  36.3636363636% {
    transform: translate(-26px, 0);
  }

  45.4545454545% {
    transform: translate(-26px, 0);
  }

  54.5454545455% {
    transform: translate(-26px, 0);
  }

  63.6363636364% {
    transform: translate(-26px, 0);
  }

  72.7272727273% {
    transform: translate(-26px, 0);
  }

  81.8181818182% {
    transform: translate(-26px, -26px);
  }

  90.9090909091% {
    transform: translate(0px, -26px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(3) {
  animation: moveBox-3 4s infinite;
}

@keyframes moveBox-4 {
  9.0909090909% {
    transform: translate(-26px, 0);
  }

  18.1818181818% {
    transform: translate(-26px, 0);
  }

  27.2727272727% {
    transform: translate(-26px, -26px);
  }

  36.3636363636% {
    transform: translate(0px, -26px);
  }

  45.4545454545% {
    transform: translate(0px, 0px);
  }

  54.5454545455% {
    transform: translate(0px, -26px);
  }

  63.6363636364% {
    transform: translate(0px, -26px);
  }

  72.7272727273% {
    transform: translate(0px, -26px);
  }

  81.8181818182% {
    transform: translate(-26px, -26px);
  }

  90.9090909091% {
    transform: translate(-26px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(4) {
  animation: moveBox-4 4s infinite;
}

@keyframes moveBox-5 {
  9.0909090909% {
    transform: translate(0, 0);
  }

  18.1818181818% {
    transform: translate(0, 0);
  }

  27.2727272727% {
    transform: translate(0, 0);
  }

  36.3636363636% {
    transform: translate(26px, 0);
  }

  45.4545454545% {
    transform: translate(26px, 0);
  }

  54.5454545455% {
    transform: translate(26px, 0);
  }

  63.6363636364% {
    transform: translate(26px, 0);
  }

  72.7272727273% {
    transform: translate(26px, 0);
  }

  81.8181818182% {
    transform: translate(26px, -26px);
  }

  90.9090909091% {
    transform: translate(0px, -26px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(5) {
  animation: moveBox-5 4s infinite;
}

@keyframes moveBox-6 {
  9.0909090909% {
    transform: translate(0, 0);
  }

  18.1818181818% {
    transform: translate(-26px, 0);
  }

  27.2727272727% {
    transform: translate(-26px, 0);
  }

  36.3636363636% {
    transform: translate(0px, 0);
  }

  45.4545454545% {
    transform: translate(0px, 0);
  }

  54.5454545455% {
    transform: translate(0px, 0);
  }

  63.6363636364% {
    transform: translate(0px, 0);
  }

  72.7272727273% {
    transform: translate(0px, 26px);
  }

  81.8181818182% {
    transform: translate(-26px, 26px);
  }

  90.9090909091% {
    transform: translate(-26px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(6) {
  animation: moveBox-6 4s infinite;
}

@keyframes moveBox-7 {
  9.0909090909% {
    transform: translate(26px, 0);
  }

  18.1818181818% {
    transform: translate(26px, 0);
  }

  27.2727272727% {
    transform: translate(26px, 0);
  }

  36.3636363636% {
    transform: translate(0px, 0);
  }

  45.4545454545% {
    transform: translate(0px, -26px);
  }

  54.5454545455% {
    transform: translate(26px, -26px);
  }

  63.6363636364% {
    transform: translate(0px, -26px);
  }

  72.7272727273% {
    transform: translate(0px, -26px);
  }

  81.8181818182% {
    transform: translate(0px, 0px);
  }

  90.9090909091% {
    transform: translate(26px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(7) {
  animation: moveBox-7 4s infinite;
}

@keyframes moveBox-8 {
  9.0909090909% {
    transform: translate(0, 0);
  }

  18.1818181818% {
    transform: translate(-26px, 0);
  }

  27.2727272727% {
    transform: translate(-26px, -26px);
  }

  36.3636363636% {
    transform: translate(0px, -26px);
  }

  45.4545454545% {
    transform: translate(0px, -26px);
  }

  54.5454545455% {
    transform: translate(0px, -26px);
  }

  63.6363636364% {
    transform: translate(0px, -26px);
  }

  72.7272727273% {
    transform: translate(0px, -26px);
  }

  81.8181818182% {
    transform: translate(26px, -26px);
  }

  90.9090909091% {
    transform: translate(26px, 0px);
  }

  100% {
    transform: translate(0px, 0px);
  }
}

.banter-loader__box:nth-child(8) {
  animation: moveBox-8 4s infinite;
}

@keyframes moveBox-9 {
  9.0909090909% {
    transform: translate(-26px, 0);
  }

  18.1818181818% {
    transform: translate(-26px, 0);
  }

  27.2727272727% {
    transform: translate(0px, 0);
  }

  36.3636363636% {
    transform: translate(-26px, 0);
  }

  45.4545454545% {
    transform: translate(0px, 0);
  }

  54.5454545455% {
    transform: translate(0px, 0);
  }

  63.6363636364% {
    transform: translate(-26px, 0);
  }

  72.7272727273% {
    transform: translate(-26px, 0);
  }

  81.8181818182% {
    transform: translate(-52px, 0);
  }

  90.9090909091% {
    transform: translate(-26px, 0);
  }

  100% {
    transform: translate(0px, 0);
  }
}

.banter-loader__box:nth-child(9) {
  animation: moveBox-9 4s infinite;
}

      </style>
      <div class="banter-loader">
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
</div>
    `
    document.body.append(div)

    // 禁止滚动
    document.body.style.overflow = 'hidden'
  }

  /**
   * 隐藏全屏 loading
   */
  hideFullScreenLoading() {
    const div = document.getElementById('app-launcher-full-screen-loading')
    if (div) {
      div.remove()
    }
    document.body.style.overflow = 'auto'
  }

  /**
   * 常规唤起操作
   */
  async normalLaunch(options: LaunchOptions): Promise<boolean> {
    const { debug, scheme, timeout } = options
    const logger = createLogger('DefaultPlugin.normalLaunch', { enabled: debug })

    const isLink = scheme.startsWith('https://')

    return new Promise((resolve) => {
      if (isLink) {
        logger.debug('唤起配置为 universalLink | app link，直接跳转')
        resolve(true)
        location.replace(scheme)
      }
      else {
        logger.debug('唤起配置为 com.xxx.yyy://，准备唤起App')

        this.showFullScreenLoading()

        location.href = scheme

        const timer = setTimeout(() => {
          logger.error('唤起超时，默认失败')

          this.hideFullScreenLoading()
          resolve(false)
        }, timeout)

        // 监听页面可见性变化（表示应用被唤起）
        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(timer)

            document.removeEventListener('visibilitychange', handleVisibilityChange)
            logger.info('检测到页面隐藏，应用可能已唤起')
            this.hideFullScreenLoading()
            resolve(true)
          }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
      }
    })
  }

  /**
   * 唤起 app
   * @param options 唤起参数
   * @param deviceInfo 设备信息
   */
  async launch(options: LaunchOptions, deviceInfo: DeviceInfo): Promise<boolean> {
    const { debug, clipboardText, onStart, onSuccess, onFail } = options

    const logger = createLogger('DefaultPlugin', { enabled: debug })

    logger.debug('launch', { options, deviceInfo })

    onStart?.()
    const res = await new Promise((resolve) => {
      if (clipboardText) {
        logger.debug('剪切板存在内容，准备写入', clipboardText)
        ClipboardUtils.copyText(clipboardText, deviceInfo, () => {
          logger.debug('剪切板写入完成，准备唤起App')
          this.normalLaunch(options).then(resolve)
        }).catch((e) => {
          logger.error('写入剪切板失败，但是不要阻塞后续的唤起流程', e)
          this.normalLaunch(options).then(resolve)
        })
      }
      else {
        this.normalLaunch(options).then(resolve)
      }
    })

    if (res) {
      onSuccess?.()
      return true
    }
    else {
      onFail?.(new Error('唤起失败'))
      return false
    }
  }
}

export class WechatPlugin extends DefaultPlugin {
  name = 'wechat'
  priority = 1

  supported(deviceInfo: DeviceInfo): boolean {
    return deviceInfo.isWechat
  }

  async launch(options: LaunchOptions, deviceInfo: DeviceInfo): Promise<boolean> {
    const { debug } = options
    const logger = createLogger('WechatPlugin', { enabled: debug })

    logger.debug('微信内打开，直接引导到外部浏览器', { options, deviceInfo })
    this.showMask()

    throw new Error('微信内打开，直接引导到外部浏览器')
  }

  /**
   * 实现一个顶部半屏遮罩，引导用户在外部浏览器打开
   */
  showMask() {
    const div = document.createElement('div')
    div.setAttribute('style', `
      position: fixed;
      background: rgba(0,0,0,.5);
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    `)

    div.innerHTML = `
    <div style="width: 100%;height: 120px; background-color: white; border-bottom: 1px solid white; border-radius: 0 0 10px 10px; text-align: center;">
      <span style="font-size: 16px;">请点击右上角 选择"在浏览器打开"</span>
      <img 
        style="position: absolute; width: 25%; right: 5%; top: 26px;"
       src="data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABQAAD/4QMsaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjUtYzAxNCA3OS4xNTE0ODEsIDIwMTMvMDMvMTMtMTI6MDk6MTUgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhENkQ0RTdBNTI4MDExRTRCQ0RFOUM2RUM2M0VEMDhEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhENkQ0RTc5NTI4MDExRTRCQ0RFOUM2RUM2M0VEMDhEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGMUJBRDdBNTIwQzExRTQ4OEM1OTM5OTY3QzdEQjEzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGMUJBRDdCNTIwQzExRTQ4OEM1OTM5OTY3QzdEQjEzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAgICAgICAgICAgMCAgIDBAMC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" alt="">
    </div>`

    document.body.append(div)
    // 禁止页面滚动
    document.body.style.overflow = 'hidden'
  }
}

export class DingTalkPlugin extends WechatPlugin {
  name = 'dingtalk'
  priority = 1

  supported(deviceInfo: DeviceInfo): boolean {
    return /DingTalk/i.test(deviceInfo.rawUA)
  }

  async launch(options: LaunchOptions, deviceInfo: DeviceInfo): Promise<boolean> {
    const { debug } = options
    const logger = createLogger('DingTalkPlugin', { enabled: debug })

    logger.debug('钉钉内打开，直接引导到外部浏览器', { options, deviceInfo })
    this.showMask()

    throw new Error('钉钉内打开，直接引导到外部浏览器')
  }
}
