<script setup lang="ts">
import { toggle } from 'radash'
import type { ShulteOptions } from './interfaces'
import { ShulteMode } from '@/config/enum.config'
import { ShulteModeDict } from '@/config/dict.config'

const router = useRouter()

const shulteOrders = [4, 5, 6, 7, 8, 9]

const shulteOptions = $ref<ShulteOptions>({
  order: 4,
  mode: ShulteMode.Positive,
})

function onSubmit() {
  router.push('/pages/shulte/questions', {
    query: shulteOptions,
  })
}
</script>

<template>
  <PageContainer append-class="space-y-10">
    <view class="space-y-2">
      <view class="card-style bg-#fff">
        <view class="title">
          题目难度
        </view>
        <view class="grid grid-cols-3">
          <view v-for="order in shulteOrders" :key="order" @click="() => shulteOptions.order = order">
            <view class="order-item" :class="{ active: order === shulteOptions.order }">
              {{ order }} x {{ order }}
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          题目模式
        </view>
        <view class="grid grid-cols-3">
          <view v-for="[mode, text] in Array.from(ShulteModeDict)" :key="mode" @click="() => shulteOptions.mode = mode">
            <view class="mode-item" :class="{ active: mode === shulteOptions.mode }">
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

.order-item,
.mode-item{
  padding: 40rpx 0;
  margin: 10rpx;
  border-radius: 20rpx;
  background-color: #efefef;
  color: #333;
  text-align: center;
  font-size: 32rpx;

  &.active{
    background-color: #3ABEF9;
    color:#fff;
  }
}
</style>

<route lang="json">
  {
    "layout": "default",
    "meta":{ }
  }
</route>
