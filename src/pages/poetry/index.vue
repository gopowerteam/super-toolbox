<script setup lang="ts">
import { pinyin } from 'pinyin-pro'
import { RequestGenerateType } from '@gopowerteam/request'
import { PoetryService } from '@/http/services/PoetryService'
import type { Poetry } from '@/http/models/Poetry'

const poetryService = new PoetryService()

const router = useRouter()
let audioContext: UniApp.InnerAudioContext

let poetry = $ref<Poetry>()
let content = $ref<{ text: string, pinyin?: string, symbol: boolean }[][]>([])
let scrollViewId = $ref<string>()
let showAnimate = $ref(true)
let showMenu = $ref<boolean>(false)
let showPinyin = $ref(true)

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

function onTogglePinyin() {
  showMenu = false
  showPinyin = !showPinyin
}

function onBack() {
  showMenu = false
  router.back()
}

function onNext() {
  showAnimate = false

  poetryService.random().then((data) => {
    showAnimate = true
    poetry = data
    generateContent()

    scrollViewId = ''
    nextTick(() => {
      scrollViewId = `poetry-${data.id}`
    })
  })

  showMenu = false
}

function onSpeak() {
  showMenu = false
  if (audioContext) {
    audioContext.pause()
  }

  if (poetry) {
    audioContext = uni.createInnerAudioContext()
    audioContext.src = poetryService.speak(poetry.id, [], { type: RequestGenerateType.URL })
    audioContext.onCanplay(() => {
      audioContext.play()
    })
  }
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
    <NutAnimate type="slide-left" :show="showAnimate">
      <view v-if="poetry && content?.length" class="absolute inset-0 flex-center">
        <scroll-view scroll-with-animation scroll-y :scroll-into-view="scrollViewId" class="text-center absolute inset-0">
          <text :id="`poetry-${poetry.id}`" />
          <view class="space-y-60rpx poetry-container">
            <view class="space-y-20rpx">
              <view class="title text-50rpx px-40rpx tracking-widest">
                {{ poetry.title }}
              </view>
              <view class="author text-28rpx">
                <text>[{{ poetry.dynasty }}]</text>
                <text> {{ poetry.author }}</text>
              </view>
            </view>
            <view class="content space-y-30rpx text-32rpx">
              <view v-for="(sentence, sentenceIndex) in content" :key="sentenceIndex" class="flex items-end justify-center sentence flex-wrap">
                <view v-for="(word, sectionIndex) in sentence" :key="sectionIndex" :class="{ word: !word.symbol, symbol: word.symbol }">
                  <view v-if="word.pinyin && showPinyin" class="text-#666 text-20rpx">
                    {{ word?.pinyin }}
                  </view>
                  <view class="text-42rpx">
                    {{ word?.text }}
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </NutAnimate>
  </view>
  <NutFixedNav v-model:visible="showMenu" un-active-text="更多" active-text="收起" :style="{ position: 'absolute', width: '100rpx' }" type="right" :position="{ bottom: '50rpx' }">
    <template #list>
      <ul class="nut-fixed-nav__list">
        <li class="nut-fixed-nav__list-item">
          <view class="text-center space-y-1" @click="onNext">
            <view class="icon-park-outline:refresh text-#333 text-24rpx h-40rpx" />
            <view class="text-24rpx text-#333">
              换一首
            </view>
          </view>
        </li>
        <li class="nut-fixed-nav__list-item">
          <view class="text-center space-y-1" @click="onSpeak">
            <view class="icon-park-outline:speaker-one text-#333 text-24rpx h-40rpx" />
            <view class="text-24rpx text-#333">
              朗诵
            </view>
          </view>
        </li>
        <li class="nut-fixed-nav__list-item">
          <view class="text-center space-y-1" @click="onTogglePinyin">
            <view class="text-22rpx text-center inline-block italic text-center h-40rpx" :class="showPinyin ? 'text-#333' : 'text-#999'">
              {{ showPinyin ? '开' : '关' }}<view />
            </view>
            <view class="text-24rpx text-#333">
              拼音
            </view>
          </view>
        </li>
        <li class="nut-fixed-nav__list-item">
          <view class="text-center space-y-1" @click="onBack">
            <view class="icon-park-outline:back text-#333 text-24rpx h-40rpx" />
            <view class="text-24rpx text-#333">
              返回
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
    width: 65rpx;
  }
  .symbol{
    width: 10rpx;
  }
}

.poetry-container{
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
  box-sizing: border-box;
  color: #000;
}
</style>

<route lang="json">
  {
    "style":{
      "navigationBarTitleText": "诗词",
      "navigationStyle": "custom",
      "pageOrientation": "auto"
    },
    "meta":{}
  }
</route>
