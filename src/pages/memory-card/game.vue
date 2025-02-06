<script setup lang="ts">
import { shuffle } from 'radash'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { MemoryCardMode } from '@/config/enum.config'
import { mediaConfig } from '@/config/media.config'
import PatternIcon from '@/components/pattern-icon.vue'

const audios = {
  correct: uni.createInnerAudioContext(),
  incorrect: uni.createInnerAudioContext(),
}

audios.correct.src = mediaConfig.audio.correct
audios.incorrect.src = mediaConfig.audio.incorrect

interface Card {
  id: number
  value: number
  flipped: boolean
  matched: boolean
}

const router = useRouter()

let options = $ref<{
  count: number
  mode: MemoryCardMode
}>()

let cards = $ref<Card[]>([])
let flippedCards = $ref<Card[]>([])
let score = $ref(0)
let isGameOver = $ref(false)
let millisecondsTotal = $ref(0)

const { pause: pauseTotal, resume: resumeTotal } = useIntervalFn(() => {
  millisecondsTotal += 100
}, 100, {
  immediate: false,
  immediateCallback: false,
})

function generateCards() {
  const values = Array.from({ length: options!.count / 2 }, (_, i) => i + 1)
  const pairs = [...values, ...values]
  const shuffled = shuffle(pairs)

  cards = shuffled.map((value, index) => ({
    id: index,
    value,
    flipped: false,
    matched: false,
  }))
}

function onCardClick(card: Card) {
  if (card.flipped || card.matched || flippedCards.length >= 2)
    return

  card.flipped = true
  flippedCards.push(card)

  if (flippedCards.length === 2) {
    if (flippedCards[0].value === flippedCards[1].value) {
      // Match found
      flippedCards.forEach(c => c.matched = true)
      score += 10
      audios.correct.play()
      flippedCards = []

      // Check if game is over
      if (cards.every(c => c.matched)) {
        isGameOver = true
        pauseTotal()
      }
    }
    else {
      // No match
      audios.incorrect.play()
      setTimeout(() => {
        flippedCards.forEach(c => c.flipped = false)
        flippedCards = []
      }, 1000)
    }
  }
}

function reset() {
  generateCards()
  flippedCards = []
  score = 0
  isGameOver = false
  millisecondsTotal = 0
  resumeTotal()
}

onPageLoad(() => {
  options = {
    count: Number(router.getQuery('count')),
    mode: router.getQuery('mode') as MemoryCardMode,
  }

  generateCards()
  resumeTotal()
})
</script>

<template>
  <PageContainer :padding="false">
    <view v-if="!isGameOver" class="game-container">
      <view class="game-header">
        <view class="info-item">
          <text class="label">
            得分
          </text>
          <text class="value">
            {{ score }}
          </text>
        </view>
        <view class="info-item">
          <text class="label">
            用时
          </text>
          <text class="value">
            {{ dayjs.duration(millisecondsTotal).format("mm:ss") }}
          </text>
        </view>
      </view>
      <view
        class="card-grid grid gap-4 p-4 bg-white rounded-4 shadow"
        :class="[
          {
            'grid-cols-4': options!.count <= 24,
            'grid-cols-6': options!.count > 24,
          },
        ]"
        :style="{ '--card-count': options?.count || 16 }"
      >
        <view
          v-for="card in cards"
          :key="card.id"
          class="card"
          :class="{ flipped: card.flipped || card.matched }"
          @click="() => onCardClick(card)"
        >
          <view class="card-inner">
            <view class="card-front">
              <view class="card-pattern">
                ?
              </view>
            </view>
            <view class="card-back">
              <template v-if="options?.mode === MemoryCardMode.Number">
                {{ card.value }}
              </template>
              <template v-else>
                <PatternIcon :value="card.value" />
              </template>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="result-container">
      <view>
        <NutCellGroup title="游戏结果">
          <NutCell title="总分" :desc="score.toString()" />
          <NutCell title="用时" :desc="`${(millisecondsTotal / 1000).toFixed(1)}秒`" />
        </NutCellGroup>
      </view>
      <view class="button-group">
        <NutButton block type="primary" custom-color="#3ABEF9" @click="reset">
          再来一局
        </NutButton>
        <NutButton block type="primary" custom-color="#999" @click="() => router.back()">
          返回
        </NutButton>
      </view>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
.page-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.game-container {
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  gap: 30rpx;
}

.game-header {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;

  .label {
    font-size: 24rpx;
    color: #999;
  }

  .value {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
  }
}

.card-grid {
  flex: 1;
  display: grid;
  gap: 16rpx;
  padding: 16rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

}

.result-container {
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.card {
  width: 100%;
  aspect-ratio: 1/1;
  perspective: 1000px;
  touch-action: manipulation;
  font-size: calc(32rpx - var(--card-count, 16) / 8 * 1rpx);
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
  user-select: none;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
  font-weight: bold;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.card-front {
  background-color: #3ABEF9;
  color: white;
  background-image: linear-gradient(135deg, #3ABEF9, #2196F3);

  .card-pattern {
    font-size: 48rpx;
    font-weight: bold;
    opacity: 0.5;
  }
}

.card-back {
  background-color: #fff;
  color: #333;
  transform: rotateY(180deg);
  border: 1px solid rgba(58, 190, 249, 0.3);

  :deep(svg) {
    color: #3ABEF9;
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
