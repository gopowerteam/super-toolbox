<script setup lang="ts">
import { draw, shuffle } from 'radash'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import type { ShulteOptions, ShulteResult } from './interfaces'
import { ShulteMode } from '@/config/enum.config'
import { mediaConfig } from '@/config/media.config'
import { ShulteModeDict } from '@/config/dict.config'

const audios = {
  correct: uni.createInnerAudioContext(),
  incorrect: uni.createInnerAudioContext(),
}

audios.correct.src = mediaConfig.audio.correct
audios.incorrect.src = mediaConfig.audio.incorrect

interface ShutlteItem {
  selected: boolean
  value: number
  time?: number
}

let startTime: Date

const router = useRouter()

let options = $ref<ShulteOptions>()
let result = $ref<ShulteResult>()

let shulteItems = $ref<ShutlteItem[]>([])

let millisecondsTotal = $ref(0)
let incorrectItem = $ref<number>()
let incorrectCount = $ref<number>(0)
let nextItem = $ref<number>()

let incorrectTimeout: number

const { pause: pauseTotal, resume: resumeTotal } = useIntervalFn(() => {
  millisecondsTotal += 100
}, 100, {
  immediate: false,
  immediateCallback: false,
})

function generateItems() {
  const items = Array.from(Array(options!.order ** 2), (_, index) => ({
    value: index + 1,
    selected: false,
  }))

  shulteItems = shuffle(items)
}

function onSelect(item: ShutlteItem) {
  if (item.selected) {
    return
  }

  if (item.value === nextItem) {
    item.selected = true
    item.time = dayjs().diff(startTime, 'milliseconds')
    audios.correct.stop()
    audios.correct.play()
    drawNextItem()
  }
  else {
    clearTimeout(incorrectTimeout)
    incorrectItem = item.value
    incorrectCount += 1
    audios.incorrect.stop()
    audios.incorrect.play()
    incorrectTimeout = setTimeout(() => {
      incorrectItem = undefined
    }, 500)
  }
}

function drawNextItem() {
  if (shulteItems.every(item => item.selected)) {
    pauseTotal()
    generateResult()
    return
  }

  startTime = new Date()

  switch (options!.mode) {
    case ShulteMode.Positive:
      nextItem = ((nextItem ?? 0) + 1)
      break
    case ShulteMode.Reverse:
      nextItem = ((nextItem ?? shulteItems.length + 1) - 1)
      break
    case ShulteMode.Random:
      nextItem = draw(shulteItems.filter(item => !item.selected))!.value
      break
  }
}

function generateResult() {
  result = {
    timeTotal: millisecondsTotal,
    timeAvg: millisecondsTotal / options!.order ** 2,
    timeFastest: Math.min(...shulteItems.map(x => x.time!)),
    timeSlowest: Math.max(...shulteItems.map(x => x.time!)),
    counterRight: options!.order ** 2,
    counterWrong: incorrectCount,
    rightRate: Math.floor((options!.order ** 2 / (incorrectCount + options!.order ** 2)) * 100),
  }
}

function reset() {
  millisecondsTotal = 0

  incorrectItem = undefined
  incorrectCount = 0
  nextItem = undefined

  generateItems()
  drawNextItem()
  resumeTotal()

  result = undefined
}

onPageLoad(() => {
  options = {
    mode: router.getQuery('mode') as ShulteMode,
    order: Number(router.getQuery('order')),
  }

  generateItems()
  drawNextItem()
  resumeTotal()
})
</script>

<template>
  <PageContainer>
    <view v-if="options">
      <view v-if="!result">
        <view class="flex-center">
          <view class="next-item">
            {{ nextItem }}
          </view>
        </view>
        <view>
          <NutGrid :column-num="options.order" :border="false" square>
            <NutGridItem v-for="item in shulteItems" :key="item.value">
              <view
                :class="{ correct: item.selected, incorrect: incorrectItem === item.value }" :style="{ fontSize: `${64 - options.order * 3}rpx` }" class="grid-item absolute inset-0 bg-red flex-center"
                @click="() => onSelect(item)"
              >
                {{ item.value }}
              </view>
            </NutGridItem>
          </NutGrid>
        </view>
        <view class="index py-40rpx px-40rpx text-#999 text-center fixed bottom-0 left-0 right-0 flex justify-between">
          <view>
            {{ shulteItems.filter(item => item.selected).length }} / {{ shulteItems.length }}
          </view>
          <view>
            {{ dayjs.duration(millisecondsTotal).format("mm:ss") }}
          </view>
        </view>
      </view>

      <view v-if="result" class="result space-y-5">
        <view>
          <NutCellGroup title="题目信息">
            <NutCell title="题目难度" :desc="`${options.order}x${options.order}`" />
            <NutCell title="题目模式" :desc="ShulteModeDict.get(options.mode)" />
          </NutCellGroup>
          <NutCellGroup title="测试结果">
            <NutCell title="总共用时" :desc="`${(result.timeTotal / 1000).toFixed(1)}秒`" />
            <NutCell title="平均用时" :desc="`${(result.timeAvg / 1000).toFixed(1)}秒`" />
            <NutCell title="最快用时" :desc="result.timeFastest ? `${(result.timeFastest / 1000).toFixed(1)}秒` : '-'" />
            <NutCell title="最慢用时" :desc="result.timeSlowest ? `${(result.timeSlowest / 1000).toFixed(1)}秒` : '-'" />
            <NutCell title="正确题数" :desc="`${result.counterRight}道`" />
            <NutCell title="错误题数" :desc="`${result.counterWrong}道`" />
            <NutCell title="正确率" :desc="`${result.rightRate}%`" />
          </NutCellGroup>
        </view>
        <view class="space-y-2">
          <NutButton block type="primary" custom-color="#3ABEF9" @click="reset">
            重做
          </NutButton>
          <NutButton block type="primary" custom-color="#999" @click="() => router.back()">
            返回
          </NutButton>
        </view>
      </view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.next-item{
  background-color: #3ABEF9;
  color: #fff;
  margin: 100rpx;
  border-radius: 10rpx;
  height: 150rpx;
  width: 150rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:48rpx;
  font-weight: bold;
}
.grid-item{
  color: #fff;
  border-radius: 10rpx;
  margin: 5rpx;
  background-color: #999;
  transition: background-color 0.2s ease-out;

  &.correct{
    background-color: #3ABEF9;
  }
  &.incorrect{
    background-color: #f00;
  }
}
</style>

<route lang="json">
  {
    "layout": "default",
    "meta":{ }
  }
</route>
