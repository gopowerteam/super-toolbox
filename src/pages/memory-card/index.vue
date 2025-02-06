<script setup lang="ts">
import { MemoryCardMode } from '@/config/enum.config'
import { MemoryCardModeDict } from '@/config/dict.config'

const router = useRouter()
const cardCounts = [16, 20, 24, 36, 48, 60]
const cardOptions = $ref({
  count: 16,
  mode: MemoryCardMode.Number,
})

function onSelectCount(count: number) {
  cardOptions.count = count
}

function onSelectMode(mode: MemoryCardMode) {
  cardOptions.mode = mode
}

function onSubmit() {
  router.push('/pages/memory-card/game', {
    query: cardOptions,
  })
}
</script>

<template>
  <PageContainer append-class="space-y-10">
    <view class="space-y-2">
      <view class="card-style bg-#fff">
        <view class="title">
          游戏模式
        </view>
        <view class="grid grid-cols-2">
          <view v-for="[mode, text] in Array.from(MemoryCardModeDict)" :key="mode" @click="() => onSelectMode(mode)">
            <view class="mode-item" :class="{ active: cardOptions.mode === mode }">
              {{ text }}
            </view>
          </view>
        </view>
      </view>
      <view class="card-style bg-#fff">
        <view class="title">
          卡片数量
        </view>
        <view class="grid grid-cols-2">
          <view v-for="count in cardCounts" :key="count" @click="() => onSelectCount(count)">
            <view class="count-item" :class="{ active: cardOptions.count === count }">
              {{ count }}
            </view>
          </view>
        </view>
      </view>
      <view>
        <NutButton block type="primary" custom-color="#3ABEF9" @click="onSubmit">
          开始游戏
        </NutButton>
      </view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.title {
  font-weight: bold;
  font-size: 32rpx;
  padding: 10rpx 20rpx;
}

.mode-item,
.count-item {
  padding: 40rpx 0;
  margin: 10rpx;
  border-radius: 20rpx;
  background-color: #efefef;
  color: #333;
  text-align: center;

  &.active {
    background-color: #3ABEF9;
    color: #fff;
  }
}
</style>

<route lang="json">
{
  "style": {
    "navigationBarTitleText": "记忆翻牌"
  },
  "meta": {}
}
</route>
