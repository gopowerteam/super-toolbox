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
  setupAppShare()
}
