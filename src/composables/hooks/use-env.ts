function usePlatform() {
  let isMpWeixin = false
  let isH5 = false

  // #ifdef MP-WEIXIN
  isMpWeixin = true
  // #endif

  // #ifdef H5
  isH5 = true
  // #endif

  return {
    isMpWeixin,
    isH5,
  }
}

export function useEnv() {
  return {
    platform: usePlatform(),
  }
}
