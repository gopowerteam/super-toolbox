function checkAppUpdate() {
  // #ifdef MP-WEIXIN
  const updateManager = uni.getUpdateManager()

  updateManager.onUpdateReady(() => {
    uni.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: ({ confirm }) => confirm && updateManager.applyUpdate(),
    })
  })

  updateManager.onUpdateFailed(() => {
    // 新的版本下载失败
  })

  updateManager.onCheckForUpdate(({ hasUpdate }) => {
    // 请求完新版本信息的回调
    if (hasUpdate) {
      uni.showToast({
        title: '检测到新版本,正在准备更新',
        mask: true,
      })
    }
  })
  // #endif
}

function setupAppShare() {
  // #ifdef MP-WEIXIN
  const descriptor = Object.getOwnPropertyDescriptor(wx, 'onAppRoute')
  const onAppRoute = descriptor?.value

  if (onAppRoute) {
    onAppRoute(() => {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline'],
      })
    })
  }
  // #endif
}

export function appLaunch() {
  // #ifdef MP-WEIXIN
  checkAppUpdate()
  setupAppShare()
  // #endif
}
