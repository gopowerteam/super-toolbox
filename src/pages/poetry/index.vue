<script setup lang="ts">
import { pinyin } from 'pinyin-pro'
import { PoetryService } from '@/http/services/PoetryService'
import type { Poetry } from '@/http/models/Poetry'

const poetryService = new PoetryService()

let visible = $ref<boolean>(false)
let poetry = $ref<Poetry>()
let content = $ref<{ text: string, pinyin?: string, symbol: boolean }[][]>([])
let scrollViewId = $ref<string>()

function generateContent() {
  if (!poetry) {
    return
  }

  const data = poetry.content.replace(/(\n|\r)/g, '')
  const reg = /[^A-Z0-9\u4E00-\u9FA5+]/gi
  const sentences = []
  let sentence = []

  for (let i = 0; i < data.length; i++) {
    const text = data[i]
    if (reg.test(text)) {
      sentence.push({
        text,
        symbol: true,
      })
      sentences.push(sentence)
      sentence = []
    }
    else {
      sentence.push({
        text,
        pinyin: pinyin(text),
        symbol: false,
      })
    }
  }

  content = sentences
}

function onNext() {
  poetryService.random().then((data) => {
    poetry = data
    generateContent()

    scrollViewId = ''
    nextTick(() => {
      scrollViewId = `poetry-${data.id}`
    })
  })

  visible = false
}

function requestTodayPoetry() {
  poetryService.today().then((data) => {
    poetry = data
    generateContent()

    scrollViewId = ''
    nextTick(() => {
      scrollViewId = `poetry-${data.id}`
    })
  })
}
onPageLoad(() => {
  requestTodayPoetry()
})
</script>

<template>
  <view>
    <NutAnimate type="slide-top" :show="poetry && content?.length !== 0">
      <view v-if="poetry && content?.length" class="absolute inset-0 flex-center">
        <scroll-view scroll-with-animation scroll-y :scroll-into-view="scrollViewId" class="text-center poetry-container">
          <view class="space-y-60rpx">
            <view class="space-y-20rpx">
              <view :id="`poetry-${poetry.id}`" class="title text-56rpx">
                {{ poetry.title }}
              </view>
              <view class="author text-28rpx">
                <text>[{{ poetry.dynasty }}]</text>
                <text> {{ poetry.author }}</text>
              </view>
            </view>
            <view class="content space-y-30rpx text-32rpx">
              <view v-for="(sentence, sentenceIndex) in content" :key="sentenceIndex" class="flex items-end justify-center sentence">
                <view v-for="(word, sectionIndex) in sentence" :key="sectionIndex" :class="{ word: !word.symbol, symbol: word.symbol }">
                  <view v-if="word.pinyin" class="text-#333">
                    {{ word?.pinyin }}
                  </view>
                  <view class="text-42rpx">
                    {{ word?.text }}
                  </view>
                </view>
              </view>
              <view v-for="i in 1000" :key="i">
                123
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </NutAnimate>
  </view>
  <NutFixedNav v-model:visible="visible" un-active-text="更多" active-text="收起" :style="{ position: 'absolute', width: '100rpx' }" type="right" :position="{ bottom: '50rpx' }">
    <template #list>
      <ul class="nut-fixed-nav__list">
        <li class="nut-fixed-nav__list-item">
          <view class="flex flex-col flex-center space-y-1" @click="onNext">
            <i class="icon-park-outline:refresh text-#333 text-24rpx" />
            <view class="text-24rpx text-#333">
              换一首
            </view>
          </view>
        </li>
      </ul>
    </template>
  </NutFixedNav>
</template>

<style scoped lang="scss">
:deep(.nut-fixed-nav__btn){
  width: 100rpx;

  &>.text{
    font-size: 24rpx!important;
    width: 60rpx;
  }
}

:deep(.nut-animate__container){
  position: absolute;
  inset:0;
}

.sentence{
  .word{
    width: 80rpx;
  }
  .symbol{
    width: 20rpx;
  }
}

.poetry-container{
  max-height: 100%;
  overflow: auto;
  padding: 100px 0;
  box-sizing: border-box;
  max-width: 100%;
}
</style>

<route lang="json">
  {
    "layout": "default",
    "meta":{},
    "style":{
       "navigationStyle": "custom",
       "pageOrientation": "auto",
       "resizable": true
    }
  }
</route>
