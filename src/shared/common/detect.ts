/* eslint-disable regexp/optimal-quantifier-concatenation */
/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/no-unused-capturing-group */
interface EnvResult {
  device: {
    isTablet: boolean
    isMobile: boolean
    isDesktop: boolean
  }
  system: {
    isPhone: boolean
    isAndroid: boolean
    isMac: boolean
    isWin: boolean
  }
  platform: {
    isWeb: boolean
    isMpWeixin: boolean
  }
  browser: {
    isChrome: boolean
    isEdge: boolean
    isIE: boolean
    isFirefox: boolean
    isOpera: boolean
    isSafari: boolean
  }
}

function detectWebEnv() {
  // #ifdef WEB
  const ua = window.navigator.userAgent
  // #endif
  const isAndroid = /Android/.test(ua)
  const isFireFox = /Firefox/.test(ua)
  const isChrome = /Chrome|CriOS/.test(ua)
  const isTablet = /iPad|PlayBook/.test(ua) || (isAndroid && !/Mobile/.test(ua)) || (isFireFox && /Tablet/.test(ua))
  const isPhone = /iPhone/.test(ua) && !isTablet
  const isDesktop = !isPhone && !isAndroid
  const isMobile = !isDesktop && !isTablet
  const isEdge = /Edge\/([0-9._]+)/.test(ua)
  const isIE = /MSIE\s([0-9.]+);.*Trident\/[4-7].0/.test(ua)
  const isFirefox = /Firefox\/([0-9.]+)(?:\s|$)/.test(ua)
  const isOpera = /Opera\/([0-9.]+)(?:\s|$)/.test(ua)
  const isSafari = /Version\/([0-9._]+).*Safari/.test(ua)
  const isMac = /macintosh|mac os x/i.test(ua)
  const isWin = /windows|win32/i.test(ua)

  return {
    device: {
      isTablet,
      isMobile,
      isDesktop,
    },
    system: {
      isPhone,
      isAndroid,
      isMac,
      isWin,
    },
    browser: {
      isChrome,
      isEdge,
      isIE,
      isFirefox,
      isOpera,
      isSafari,
    },
  }
}

function detectMiniAppEnv() {
  return {
    device: {
      isTablet: false,
      isMobile: true,
      isDesktop: false,
    },
    system: {
      isPhone: uni.getSystemInfoSync().platform === 'ios',
      isAndroid: uni.getSystemInfoSync().platform === 'android',
      isMac: uni.getSystemInfoSync().platform === 'mac',
      isWin: uni.getSystemInfoSync().platform === 'windows',
      isLinux: uni.getSystemInfoSync().platform === 'linux',
    },
    browser: {
      isChrome: false,
      isEdge: false,
      isIE: false,
      isFirefox: false,
      isOpera: false,
      isSafari: false,
    },
  }
}

export function detectPlatform() {
  let platform: 'MP-WEIXIN' | 'WEB'

  // #ifdef MP-WEIXIN
  platform = 'MP-WEIXIN'
  // #endif
  // #ifdef WEB
  platform = 'WEB'
  // #endif

  platform = platform as 'MP-WEIXIN' | 'WEB'

  return {
    platform,
    isMpWeixin: platform === 'MP-WEIXIN',
    isWeb: platform === 'WEB',
  }
}

export function detectEnv(): EnvResult {
  const platformResult = detectPlatform()

  const getPlatformEnv = () => {
    switch (platformResult.platform) {
      case 'MP-WEIXIN':
        return detectMiniAppEnv()
      case 'WEB':
        return detectWebEnv()
    }
  }

  return {
    ...getPlatformEnv()!,
    platform: {
      isMpWeixin: platformResult.isMpWeixin,
      isWeb: platformResult.isWeb,
    },
  }
}
