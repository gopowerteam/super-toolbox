<script setup lang="ts">
import { random, shuffle } from 'radash'
import type { Canvas } from '@uni-helper/uni-app-types'
import dayjs from 'dayjs'
import type { CalculationOptions, Question, QuestionRecord } from './interfaces'
import { CalculationType } from '@/config/enum.config'
import { mediaConfig } from '@/config/media.config'

const audios = {
  correct: uni.createInnerAudioContext(),
  incorrect: uni.createInnerAudioContext(),
}

audios.correct.src = mediaConfig.audio.correct
audios.incorrect.src = mediaConfig.audio.incorrect

const router = useRouter()

let canvasWidth: number
let canvasHeight: number
let ctx: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D

const pagePaddingRateX = 0.05
const pagePaddingRateY = 0.1

let options: CalculationOptions
let questions = $ref<Question[]>([])

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
    symbol: '+',
    text: `${numberA} + ${numberB} =`,
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
    symbol: '-',
    text: `${numberA} - ${numberB} =`,
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
    symbol: '×',
    text: `${numberA} × ${numberB} =`,
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
    symbol: '÷',
    text: `${numberA} ÷ ${numberB} =`,
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
  questions = Array.from(Array(options.count), () => {
    const type = options.types[Math.round(random(0, options.types.length - 1))]
    return generateQuestion(type)!
  })
}

function drawBackground() {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
}

function drawHeader() {
  const pagePaddingX = canvasWidth * pagePaddingRateX
  const pagePaddingY = canvasWidth * pagePaddingRateY
  const fontPaddingX = canvasWidth * 0.01
  const fontPaddingY = canvasWidth * 0.01
  const fontSize = 10

  // 绘制标题线
  ctx.fillStyle = '#999'
  ctx.lineWidth = 1
  ctx.strokeStyle = '#999'
  ctx.moveTo(pagePaddingX, pagePaddingY)
  ctx.lineTo(canvasWidth - pagePaddingX, pagePaddingY)
  ctx.stroke()
  // 绘制日期栏
  ctx.textAlign = 'left'
  ctx.font = `bold ${fontSize}px serif`
  ctx.fillStyle = '#333'
  ctx.fillText('日期:', pagePaddingX + fontPaddingX, pagePaddingY - fontSize - fontPaddingY)
}

function drawQuestions() {
  const pagePaddingX = canvasWidth * pagePaddingRateX + canvasWidth * 0.05
  const pagePaddingY = canvasHeight * pagePaddingRateY
  const count = questions.length
  let fontSize: number
  let columns: number

  switch (count) {
    case 80:
      [columns, fontSize] = [4, 8]; break
    case 60:
      [columns, fontSize] = [3, 12]; break
    case 40:
      [columns, fontSize] = [2, 16]; break
    case 20:
    default:
      [columns, fontSize] = [2, 16]; break
  }

  const rows = count / columns
  const rowOffset = (canvasHeight - (pagePaddingY)) / rows
  const columnOffset = (canvasWidth - (pagePaddingX * 2)) / columns

  ctx.textAlign = 'right'
  ctx.font = `normal ${fontSize}px serif`
  ctx.fillStyle = '#333'
  const length = options.range.toString().length
  const { width: maxWidth } = ctx.measureText(`${'0'.repeat(length)} _ ${'0'.repeat(length)} = `)

  questions.forEach((question, index) => {
    const row = Math.floor(index / columns)
    const column = index % columns
    const x = pagePaddingX + columnOffset * column + maxWidth
    const y = pagePaddingY + rowOffset * row + ((rowOffset - fontSize) / 2)

    ctx.fillText(question.text, x, y)
  })
}

function drawQuestionCanvas() {
  nextTick(() => {
    const query = uni.createSelectorQuery()
    query.select('#canvas')
      .fields({ node: true, size: true }, (res) => {
        const { node, width, height } = res as { node: Canvas, width: number, height: number }
        const canvas = node as unknown as WechatMiniprogram.Canvas
        ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvasWidth = width
        canvasHeight = height
        // #ifdef MP-WEIXIN
        ctx.scale(dpr, dpr)
        // #endif
        drawBackground()
        drawHeader()
        drawQuestions()
      })
      .exec()
  })
}

function onExport() {
  const query = uni.createSelectorQuery()
  query.select('#canvas')
    .fields({ node: true, size: true }, (res) => {
      const { node, width, height } = res as { node: Canvas, width: number, height: number }
      uni.canvasToTempFilePath({
        x: 0,
        y: 0,
        width,
        height,
        destWidth: 2479,
        destHeight: 3508,
        canvasId: 'canvas',
        canvas: node,
        success(res) {
          // #ifdef H5
          downloadFileH5(res.tempFilePath)
          // #endif
          // #ifdef MP-WEIXIN
          downloadFileMpWeixin(res.tempFilePath)
          // #endif
        },
        fail(err) {
          console.error(err)
        },
      })
    })
    .exec()
}

function downloadFileMpWeixin(url: string) {
  uni.saveImageToPhotosAlbum({
    filePath: url,
  })
}

function downloadFileH5(url: string) {
  const parts = url.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }

  const blob = new window.Blob([uInt8Array], { type: contentType })
  const tmpLink = document.createElement('a')
  tmpLink.download = dayjs().format('YYYY-MM-DD HH:mm:ss') || 'download'
  tmpLink.href = URL.createObjectURL(blob)
  tmpLink.click()

  setTimeout(() => {
    URL.revokeObjectURL(tmpLink.href)
  }, 1000)
}

function onReset() {
  generateQuestions()
  drawQuestionCanvas()
}

onPageLoad(() => {
  options = {
    count: Number(router.getQuery('count')),
    types: router.getQuery('types') as unknown as CalculationType[],
    range: Number(router.getQuery('range')),
  }

  generateQuestions()
  drawQuestionCanvas()
})
</script>

<template>
  <PageContainer append-class="text-#333 space-y-4" :padding="false">
    <view class="canvas-container">
      <canvas id="canvas" type="2d" style="width: 750rpx; height:1060rpx;" canvas-id="canvas" />
    </view>
    <view class="p-20rpx space-y-2">
      <NutButton block type="primary" custom-color="#3ABEF9" @click="onExport">
        导出
      </NutButton>
      <NutButton block type="primary" custom-color="#999" @click="onReset">
        重新生成
      </NutButton>
    </view>
  </PageContainer>
</template>

<style scoped lang="scss">
</style>

<route lang="json">
  {
    "navigationBarTitleText": "计算试题",
    "meta":{ }

  }
</route>
