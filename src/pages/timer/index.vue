<script setup lang="ts">
import dayjs from 'dayjs'
import { useIntervalFn } from '@vueuse/core'
import FilpNumber from './components/filp-number.vue'

let timestamp = $ref(Date.now())

const { resume } = useIntervalFn(() => {
  timestamp = Date.now()
}, 1000, {
  immediate: false,
  immediateCallback: true,
})

const time = $computed(() => {
  const value = dayjs(timestamp)
  return {
    hour: value.hour(),
    minute: value.minute(),
    second: value.second(),
  }
})

function createMediaQueryObserver() {
  const landscapeOb = uni.createMediaQueryObserver(getCurrentInstance())

  landscapeOb.observe({
    orientation: 'landscape', // 屏幕方向为横屏portrait
  } as any, ({ matches }) => {
    if (matches !== undefined) {
      // console.log('横屏')
    }
  })
}

onPageLoad(() => {
  resume()
  createMediaQueryObserver()
})
</script>

<template>
  <view class="flex-center absolute inset-0 bg-#111">
    <view class="flex flex-col items-center justify-center space-y-20rpx">
      <FilpNumber :value="time.hour" />
      <FilpNumber :value="time.minute" />
      <FilpNumber :value="time.second" />
    </view>
  </view>
</template>

<style scoped>

</style>

<route lang="json">
  {
    "layout": "default",
    "meta":{},
    "style":{
       "navigationStyle": "custom",
       "pageOrientation": "auto"
    }
  }
</route>
