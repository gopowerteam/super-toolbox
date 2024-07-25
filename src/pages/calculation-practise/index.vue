<script setup lang="ts">
import { toggle } from 'radash'
import type { CalculationOptions } from './interfaces'
import { CalculationMode, CalculationRange, CalculationType } from '@/config/enum.config'
import { CalculationModeDict, CalculationRangeDict, CalculationTypeDict } from '@/config/dict.config'

const router = useRouter()
const calculationCounts = [10, 20, 40, 60]
const calculationTimes = [3, 5, 10, 15, 20, 30]

const calculationOptions = $ref<CalculationOptions>({
  count: 20,
  time: 10,
  types: [CalculationType.Add, CalculationType.Subtract],
  range: CalculationRange.Hundred,
  mode: CalculationMode.Select,
})

function onSelectType(type: CalculationType) {
  calculationOptions.types = toggle(calculationOptions.types, type)
}

function onSelectRange(range: CalculationRange) {
  calculationOptions.range = range
}

function onSelectMode(mode: CalculationMode) {
  calculationOptions.mode = mode
}

function onSelectCount(count: number) {
  calculationOptions.count = count
}

function onSelectTime(time: number) {
  calculationOptions.time = time
}

function onSubmit() {
  router.push('/pages/calculation-practise/questions', {
    query: calculationOptions,
  })
}
</script>

<template>
  <PageContainer append-class="space-y-10">
    <view class="space-y-2">
      <view class="card-style bg-#fff">
        <view class="title">
          题目类型
        </view>
        <view class="grid grid-cols-2">
          <view v-for="[type, text] in Array.from(CalculationTypeDict)" :key="type" @click="() => onSelectType(type)">
            <view class="type-item" :class="{ active: calculationOptions.types.includes(type) }">
              {{ text }}
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          题目范围
        </view>
        <view class="grid grid-cols-3">
          <view v-for="[range, text] in Array.from(CalculationRangeDict)" :key="range" @click="() => onSelectRange(range)">
            <view class="range-item" :class="{ active: calculationOptions.range === range }">
              {{ text }}
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          题目数量
        </view>
        <view class="grid grid-cols-4">
          <view v-for="item in calculationCounts" :key="item" @click="() => onSelectCount(item)">
            <view class="count-item" :class="{ active: calculationOptions.count === item }">
              {{ item }}
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          题目时间
        </view>
        <view class="grid grid-cols-3">
          <view v-for="item in calculationTimes" :key="item" @click="() => onSelectTime(item)">
            <view class="time-item" :class="{ active: calculationOptions.time === item }">
              {{ item }}秒
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          答题方式
        </view>
        <view class="grid grid-cols-2">
          <view v-for="[mode, text] in Array.from(CalculationModeDict)" :key="mode" @click="() => onSelectMode(mode)">
            <view class="mode-item" :class="{ active: calculationOptions.mode === mode }">
              {{ text }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view>
      <NutButton block type="primary" custom-color="#3ABEF9" @click="onSubmit">
        开始答题
      </NutButton>
    </view>
  </PageContainer>
</template>

<style scope lang="scss">
.title{
  font-weight: bold;
  font-size: 32rpx;
  padding: 10rpx 20rpx;
}

.type-item,
.range-item,
.count-item,
.time-item,
.mode-item{
  padding: 40rpx 0;
  margin: 10rpx;
  border-radius: 20rpx;
  background-color: #efefef;
  color: #333;
  text-align: center;

  &.active{
    background-color: #3ABEF9;
    color:#fff;
  }
}
</style>

<route lang="json">
  {
    "navigationBarTitleText": "计算练习",
    "meta":{ }
  }
</route>
