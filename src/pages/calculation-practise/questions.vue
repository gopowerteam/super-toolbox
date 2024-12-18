<script setup lang="ts">
import { random, shuffle } from 'radash'
import dayjs from 'dayjs'
import { useIntervalFn } from '@vueuse/core'
import type { CalculationOptions, CalculationResult, Question, QuestionRecord } from './interfaces'
import { CalculationMode, CalculationType } from '@/config/enum.config'
import { CalculationRangeDict, CalculationTypeDict } from '@/config/dict.config'
import { mediaConfig } from '@/config/media.config'

const audios = {
  correct: uni.createInnerAudioContext(),
  incorrect: uni.createInnerAudioContext(),
}

audios.correct.src = mediaConfig.audio.correct
audios.incorrect.src = mediaConfig.audio.incorrect

const router = useRouter()

let options: CalculationOptions
let records = $ref< QuestionRecord[]>([])
let currentIndex: number = $ref<number>(0)
let result = $ref<CalculationResult | undefined>()
let startTime: Date
let inputNumber = $ref<number | undefined>()

const currentRecord: QuestionRecord = $computed(() => {
  return records?.[currentIndex]
})

let showAnswer = $ref(true)

let millisecondsTotal = $ref(0)
let millisecondsCurrent = $ref(0)

const { pause: pauseTotal, resume: resumeTotal } = useIntervalFn(() => {
  millisecondsTotal += 100
}, 100, {
  immediate: false,
  immediateCallback: false,
})

const { pause: pauseCurrent, resume: resumeCurrent, isActive } = useIntervalFn(() => {
  if (millisecondsCurrent <= 0) {
    // 计时结束
    nextQuestion()
  }
  else {
    millisecondsCurrent -= 100
  }
}, 100, {
  immediate: false,
  immediateCallback: false,
})

watch(() => currentRecord, () => {
  if (currentRecord) {
    startTime = new Date()
    // 重置时间
    millisecondsCurrent = options.time * 1000
    // 隐藏答案
    showAnswer = false
    inputNumber = undefined
    // 开始计时
    resumeCurrent()
  }
})

function generateResult() {
  const rightRecordTimes = records
    .filter(x => !!x.time && x.answer === x.question.answer)
    .map(x => x.time!)

  const rightRecordCounter = records
    .filter(x => x.answer === x.question.answer)
    .length

  const wrongRecordCounter = records
    .filter(x => x.answer !== undefined && x.answer !== x.question.answer)
    .length

  const emptyRecordCounter = records
    .filter(x => x.answer === undefined)
    .length

  result = {
    timeTotal: millisecondsTotal,
    timeAvg: millisecondsTotal / options.count,
    timeFastest: Math.min(...rightRecordTimes),
    timeSlowest: Math.max(...rightRecordTimes),
    counter: options.count,
    counterRight: rightRecordCounter,
    counterWrong: wrongRecordCounter,
    counterEmpty: emptyRecordCounter,
    rightRate: Math.floor(rightRecordCounter / options.count * 100),
  }
}

function generateOptions(answer: number, range: number, count: number) {
  const options: number[] = []

  for (let i = 0; i < count - 1; i++) {
    let value: number
    do {
      const diff = Math.floor(random(-10, 10))
      value = diff + answer
    } while (
      value < 0 || value === answer || options.includes(value)
    )

    options.push(value)
  }

  return shuffle([
    ...options,
    answer,
  ])
}

function generateAddQuestion(range: number): Question {
  let numberA
  let numberB
  let answer

  do {
    numberA = Math.floor(random(0, range))
    numberB = Math.floor(random(0, range))
    answer = numberA + numberB
  } while (
    answer > range
  )

  return {
    numberA,
    numberB,
    text: `${numberA} + ${numberB}`,
    answer,
    options: generateOptions(answer, range, 3),
  }
}

function generateMinusQuestion(range: number): Question {
  let numberA
  let numberB
  let answer

  do {
    numberA = Math.floor(random(0, range))
    numberB = Math.floor(random(0, range))
    answer = numberA - numberB
  } while (
    answer < 0
  )

  return {
    numberA,
    numberB,
    text: `${numberA} - ${numberB}`,
    answer,
    options: generateOptions(answer, range, 3),
  }
}

function generateMultiplyQuestion(range: number): Question {
  const numberA = Math.floor(random(0, range))
  const numberB = Math.floor(random(0, range))
  const answer = numberA * numberB

  return {
    numberA,
    numberB,
    text: `${numberA} × ${numberB}`,
    answer,
    options: generateOptions(answer, range, 3),
  }
}

function generateDivideQuestion(range: number): Question {
  let numberA
  let numberB
  let answer

  do {
    answer = Math.round(random(0, range))
    numberB = Math.ceil(random(0, range))
    numberA = numberB * answer
  } while (
    numberA > range || numberB === 0
  )

  return {
    numberA,
    numberB,
    text: `${numberA} ÷ ${numberB}`,
    answer,
    options: generateOptions(answer, range, 3),
  }
}

function generateQuestion(type: CalculationType) {
  switch (type) {
    case CalculationType.Add:
      return generateAddQuestion(options.range)
    case CalculationType.Subtract:
      return generateMinusQuestion(options.range)
    case CalculationType.Multiply:
      return generateMultiplyQuestion(options.range)
    case CalculationType.Divide:
      return generateDivideQuestion(options.range)
  }
}

function generateQuestions() {
  records = Array.from(Array(options.count), (): QuestionRecord => {
    const type = options.types[Math.round(random(0, options.types.length - 1))]
    const question = generateQuestion(type)!
    return {
      question,
      time: undefined,
      answer: undefined,
    }
  })
}

function nextQuestion() {
  // 暂停计时
  pauseCurrent()
  // 显示答案
  showAnswer = true
  // 保存计时
  currentRecord.time = dayjs().diff(startTime, 'milliseconds')

  if (currentRecord.answer === currentRecord.question.answer) {
    audios.correct.stop()
    audios.correct.play()
  }
  else {
    audios.incorrect.stop()
    audios.incorrect.play()
  }

  // 1秒后跳转下一题
  setTimeout(() => {
    if (currentIndex < records.length - 1) {
      currentIndex += 1
    }
    else {
      // 结束计时
      pauseTotal()
      generateResult()
    }
  }, 1000)
}

function onSelect(value: number) {
  if (!currentRecord || !isActive.value || millisecondsCurrent <= 0) {
    return
  }

  currentRecord.answer = value

  nextQuestion()
}

function onKeyboardInput(value: string | number) {
  if (value === '重置') {
    inputNumber = undefined
    return
  }

  if (inputNumber && inputNumber.toString().length >= 6) {
    return
  }

  const newValue = Number(`${inputNumber ?? ''}${value}`)

  if (!Number.isNaN(newValue)) {
    inputNumber = newValue
  }
}
function onKeyboardDelete() {
  if (inputNumber === undefined) {
    return
  }

  if (inputNumber.toString().length === 1) {
    inputNumber = undefined
    return
  }

  const newValue = inputNumber.toString().slice(0, -1)
  inputNumber = Number(newValue)
}

function onKeyboardConfirm() {
  if (inputNumber !== undefined) {
    onSelect(inputNumber)
  }
}

function reset() {
  generateQuestions()

  // 重置计时
  millisecondsTotal = 0
  // 重置题目索引
  currentIndex = 0
  // 重置结果
  result = undefined
}

onPageLoad(() => {
  options = {
    count: Number(router.getQuery('count')),
    time: Number(router.getQuery('time')),
    types: router.getQuery('types') as unknown as CalculationType[],
    range: Number(router.getQuery('range')),
    mode: router.getQuery('mode') as CalculationMode,
  }

  generateQuestions()
  resumeTotal()
})
</script>

<template>
  <PageContainer append-class="text-#333 ">
    <view v-if="currentRecord && !result" class="flex flex-col absolute inset-0 bg-red">
      <view class="flex-center pt-50rpx">
        <view class="timer-wrapper" :style="{ background: `conic-gradient(green ${(millisecondsCurrent / (options.time * 1000) * 100).toFixed()}%, #fff 0%)` }">
          <view class="timer">
            <text v-if="!currentRecord.time">
              {{ dayjs.duration(millisecondsCurrent).format("s") }}
            </text>
            <i
              v-if="!!currentRecord.time && currentRecord.answer === currentRecord.question.answer"
              class="icon-park-outline:check text-green"
            />
            <i
              v-if="!!currentRecord.time && currentRecord.answer !== currentRecord.question.answer"
              class="icon-park-outline:close text-red"
            />
          </view>
        </view>
      </view>
      <view class="flex-auto">
        <view>
          <view v-for="record, recordIndex in records" :key="recordIndex">
            <nut-transition :show="recordIndex === currentIndex" name="fade-right" :duration="200">
              <view v-if="recordIndex === currentIndex">
                <view class="question">
                  {{ record.question.text }}
                </view>
                <view v-if="options.mode === CalculationMode.Select" class="options">
                  <view
                    v-for="item, optionIndex in record.question.options" :key="optionIndex"
                    :class="{
                      right: showAnswer && record.question.answer === item,
                      wrong: showAnswer && record.answer === item && record.answer !== record.question.answer }"
                    class="option-item" @click="() => onSelect(item)"
                  >
                    <text>{{ item }}</text>
                    <view v-if="record.question.answer === item && record.answer === item" class="right-icon icon hidden">
                      <i class="icon-park-outline:check" />
                    </view>
                    <view class="wrong-icon icon hidden ">
                      <i class="icon-park-outline:close" />
                    </view>
                  </view>
                </view>
                <view v-if="options.mode === CalculationMode.Input">
                  <view class="input-box">
                    {{ inputNumber }}
                  </view>
                </view>
              </view>
            </nut-transition>
          </view>
        </view>
      </view>
      <view v-if="options.mode === CalculationMode.Input" class="keyboard relative flex-center my-2 mx-2 overflow-hidden">
        <NutNumberKeyboard
          :custom-key="['重置']"
          confirm-text="提交"
          type="rightColumn"
          :visible="true"
          @input="onKeyboardInput"
          @delete="onKeyboardDelete" @confirm="onKeyboardConfirm"
        />
      </view>
      <view class="index py-20rpx px-20rpx text-#999 text-center flex justify-between">
        <view>
          {{ currentIndex + 1 }} / {{ options.count }}
        </view>
        <view>
          {{ dayjs.duration(millisecondsTotal).format("mm:ss") }}
        </view>
      </view>
    </view>
    <view v-if="result" class="result space-y-5">
      <view>
        <NutCellGroup title="题目信息">
          <NutCell title="题目数量" :desc="`${options.count}道`" />
          <NutCell title="题目类型" :desc="options.types.map(x => CalculationTypeDict.get(x)).join(',')" />
          <NutCell title="题目时间" :desc="`${options.time}秒`" />
          <NutCell title="题目范围" :desc="CalculationRangeDict.get(options.range)" />
        </NutCellGroup>
        <NutCellGroup title="测试结果">
          <NutCell title="总共用时" :desc="`${(result.timeTotal / 1000).toFixed(1)}秒`" />
          <NutCell title="平均用时" :desc="`${(result.timeAvg / 1000).toFixed(1)}秒`" />
          <NutCell title="最快用时" :desc="result.timeFastest ? `${(result.timeFastest / 1000).toFixed(1)}秒` : '-'" />
          <NutCell title="最慢用时" :desc="result.timeSlowest ? `${(result.timeSlowest / 1000).toFixed(1)}秒` : '-'" />
          <NutCell title="正确题数" :desc="`${result.counterRight}道`" />
          <NutCell title="错误题数" :desc="`${result.counterWrong}道`" />
          <NutCell title="超时题数" :desc="`${result.counterEmpty}道`" />
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
  </PageContainer>
</template>

<style scoped lang="scss">
.input-box{
  margin:auto;
  width: 200rpx;
  // height: 100rpx;
  text-align: center;
  border: solid 1px transparent;
  border-bottom-color: #333;
  padding: 20rpx;
  font-size: 64rpx;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.keyboard:deep(.nut-popup){
  position: relative!important;
  background-color: transparent!important;
  .nut-number-keyboard{
    background-color: transparent!important;
    padding-bottom: 0;
  }
  .nut-number-keyboard__keys{
    .nut-key__wrapper:last-child{
      .nut-key{
        font-size: 28rpx;
      }
    }
  }

}
.timer-wrapper{
  height: 150rpx;
  width: 150rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  position: relative;
}

.timer{
  position: absolute;
  inset: 10rpx;
  background-color:#fff;
  border-radius: 9999rpx;
  display: flex;
  font-size: 56rpx;
  justify-content: center;
  align-items: center;
  color: #333;
}

.question{
  display: flex;
  font-size: 90rpx;
  padding: 40rpx;
  // height: 200rpx;
  justify-content: center;
  align-items: center;
}

.option-item{
  text-align: center;
  font-size: 48rpx;
  background-color: #3ABEF9;
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 20rpx;
  color: #fff;
  position: relative;

  &.right{
    background-color: green;
    .right-icon{
      display: flex;
    }
  }
  &.wrong{
    background-color: red;

    .wrong-icon{
      display: flex;
    }
  }

  .icon{
      position: absolute;
      right: 20rpx;
      top:0;
      bottom:0;
      justify-content: center;
      align-items: center;
  }
}
</style>

<route lang="json">
  {
    "style":{
      "pageOrientation": "portrait",
      "disableScroll": true
    },
    "navigationBarTitleText": "计算练习",
    "meta":{

     }
  }
</route>
