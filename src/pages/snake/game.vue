<script setup lang="ts">
import { random } from 'radash'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { Direction } from '@/config/enum.config'

const router = useRouter()
let speed = $ref<number>(9)

const maxSpeed = 9
const size = 20
const bodyLength = 2
const speedStep = 40
const touchThreshold = 100
let timespan = 0
let points = $ref(0)
let isGameOver = $ref(false)

const timeThreshold = $computed(() => {
  return (maxSpeed - speed) * speedStep
})

let accleration = $ref(false)
let startPoint: { x: number, y: number }
let touchDirection = $ref< Direction>()
let nextDirection = $ref<Direction>()

let food = $ref<{ column: number, row: number }>()
let direction = $ref<Direction>(Direction.Up)

let rows: number = $ref(0)
let columns: number = $ref(0)
let xBorder = $ref(0)
let yBorder = $ref(0)
let milliseconds = $ref(0)

const { pause, resume } = useIntervalFn(() => {
  if (!isGameOver) {
    milliseconds += speedStep
    updateSnakeMove()
  }
}, speedStep, {
  immediate: false,
  immediateCallback: false,
})

const directionStyle = $computed(() => {
  return `${['up', 'down'].includes(direction) ? 'row' : 'column'}`
})

const horizontal = [Direction.Down, Direction.Up]
const vertical = [Direction.Left, Direction.Right]

const directionMaps = new Map<Direction, { row: number, column: number }>([
  [Direction.Up, { row: 0, column: -1 }],
  [Direction.Down, { row: 0, column: 1 }],
  [Direction.Left, { row: -1, column: 0 }],
  [Direction.Right, { row: 1, column: 0 }],
])

let snake: { column: number, row: number }[] = $ref([])

let grids = $ref<{ column: number, row: number, index: number }[]>([])

const instance = getCurrentInstance()

function updateSnakeMove(immediate?: boolean) {
  if (isGameOver) {
    return
  }

  if (timespan < timeThreshold && !immediate && !accleration) {
    timespan += speedStep
    return
  }
  else {
    timespan = 0
  }

  const [head] = snake

  if (nextDirection !== undefined) {
    direction = nextDirection
    nextDirection = undefined
  }

  const nextNode = {
    column: (head.column + directionMaps.get(direction)!.column + columns) % columns,
    row: (head.row + directionMaps.get(direction)!.row + rows) % rows,
  }

  if (snake.some(item => item.column === nextNode.column && item.row === nextNode.row)) {
    return onGameOver()
  }

  if (nextNode.column === food?.column && nextNode.row === food?.row) {
    points += 1
    snake = [nextNode, ...snake]
    generateFood()
    updateSpeed()
  }
  else {
    snake = [nextNode, ...snake.slice(0, -1)]
  }
}

function onGameOver() {
  pause()

  isGameOver = true
}

function updateSpeed() {
  if (speed >= maxSpeed) {
    return
  }

  if (points > speed ** 2) {
    speed += 1
  }
}

function generateFood() {
  const nodes = snake.map(x => `${x.column}|${x.row}`)
  const items = grids.filter(grid => !nodes.includes(`${grid.column}|${grid.row}`))
  const index = random(0, items.length - 1)
  const { column, row } = items[index]
  food = { column, row }
}

function generateStage() {
  return new Promise<void>((resolve) => {
    uni.createSelectorQuery().in(instance)
      .select('#stage-wrapper')
      .fields({ size: true }, (res) => {
        const { width, height } = res as { width: number, height: number }
        xBorder = (width % size + size) / 2
        yBorder = (height % size + size) / 2
        rows = (width - xBorder * 2) / size
        columns = (height - yBorder * 2) / size

        grids = Array.from({ length: rows * columns }, (_, index) => {
          return {
            column: Math.floor(index / rows),
            row: index % rows,
            index,
          }
        })

        resolve()
      })
      .exec()
  })
}

function generateSnake() {
  // 生成蛇头
  let node = {
    column: random(0 + 5, columns - 5),
    row: random(0 + 5, rows - 5),
  }
  const nodes = [node]

  const directionList = Object.values(Direction)
  direction = directionList[random(0, directionList.length - 1)]

  for (let i = 0; i < bodyLength; i++) {
    const nextNode = {
      column: node.column - directionMaps.get(direction)!.column,
      row: node.row - directionMaps.get(direction)!.row,
    }

    nodes.push(nextNode)
    node = nextNode
  }

  snake = nodes
}

function onTouchStart(...args: unknown[]) {
  const [event] = args as TouchEvent[]
  const [{ clientX, clientY }] = event.touches
  startPoint = {
    x: clientX,
    y: clientY,
  }

  touchDirection = undefined
}

function onTouchMove(...args: unknown[]) {
  const [event] = args as TouchEvent[]
  const [{ clientX, clientY }] = event.touches

  if (!touchDirection) {
    switch (true) {
      case Math.abs(clientX - startPoint.x) > touchThreshold:
        touchDirection = clientX - startPoint.x > 0 ? Direction.Right : Direction.Left
        break
      case Math.abs(clientY - startPoint.y) > touchThreshold:
        touchDirection = clientY - startPoint.y > 0 ? Direction.Down : Direction.Up
        break
    }
  }

  if (!touchDirection) {
    return
  }

  if (touchDirection !== direction) {
    if ([direction, touchDirection].every(x => horizontal.includes(x))) {
      return
    }

    if ([direction, touchDirection].every(x => vertical.includes(x))) {
      return
    }

    nextDirection = touchDirection
    updateSnakeMove(true)
  }
}

function onLongPress() {
  accleration = true
}

function onTouchEnd() {
  accleration = false
}

function onKeyDown(event: KeyboardEvent) {
  let keyDirection: Direction | undefined

  switch (event.key) {
    case 'ArrowUp':
      keyDirection = Direction.Up
      break
    case 'ArrowDown':
      keyDirection = Direction.Down
      break
    case 'ArrowLeft':
      keyDirection = Direction.Left
      break
    case 'ArrowRight':
      keyDirection = Direction.Right
      break
  }

  if (!keyDirection) {
    return
  }

  if (keyDirection !== direction) {
    if ([direction, keyDirection].every(x => horizontal.includes(x))) {
      return
    }

    if ([direction, keyDirection].every(x => vertical.includes(x))) {
      return
    }

    nextDirection = keyDirection
    updateSnakeMove(true)
  }
  else {
    updateSnakeMove(true)
  }
}

function onGameStart() {
  milliseconds = 0
  points = 0
  isGameOver = false

  resume()
}

async function onGameReset() {
  speed = Number(router.getQuery('speed') || 3)

  await generateStage()
  generateSnake()
  generateFood()

  milliseconds = 0
  points = 0
  isGameOver = false

  resume()
}

onPageLoad(() => {
  speed = Number(router.getQuery('speed') || 3)

  nextTick(async () => {
    await generateStage()
    generateSnake()
    generateFood()
  })

  // #ifdef H5
  document.addEventListener('keydown', onKeyDown)
  // #endif
})
</script>

<template>
  <view class="text-#333" />
  <view id="stage-wrapper" class="absolute inset-0" @longpress="onLongPress" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
    <view v-if="snake?.length && grids.length" class="stage flex flex-wrap">
      <view
        v-for="(grid, index) in grids" :key="index"
        :class="{
          food: grid.column === food?.column && grid.row === food?.row,
          head: grid.column === snake[0].column && grid.row === snake[0].row,
          odd: (grid.column + grid.row) % 2 === 0,
          even: (grid.column + grid.row) % 2 === 1,
          snake: snake.some(node => node.column === grid.column && node.row === grid.row),
        }" class="grid-item"
      />
    </view>
  </view>
  <view class="index py-40rpx px-40rpx text-#999 text-center fixed bottom-0 left-0 right-0 flex justify-between">
    <view>
      {{ points }}
    </view>
    <view>
      {{ dayjs.duration(milliseconds).format("mm:ss") }}
    </view>
  </view>
  <view v-if="!isGameOver && milliseconds === 0" class="gameStart">
    <view class="fixed inset-0 flex-center bg-#00000033">
      <NutButton type="primary" @click="onGameStart">
        开始游戏
      </NutButton>
    </view>
  </view>
  <view v-if="isGameOver" class="gameStart">
    <view class="fixed inset-0 flex-center bg-#00000033">
      <view class="space-y-4">
        <view class="text-32rpx space-y-2 text-bold">
          <view>当前得分: {{ points }}</view>
          <view>当前速度: {{ speed }}</view>
          <view>生存时间: {{ dayjs.duration(milliseconds).format("mm:ss") }}</view>
        </view>
        <view class="space-y-2">
          <NutButton block style="width:200rpx;" type="primary" @click="onGameReset">
            开始游戏
          </NutButton>
          <NutButton
            block
            style="width:200rpx;"
            type="primary" custom-color="#999"
            @click="() => router.back()"
          >
            返回
          </NutButton>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
.stage{
  border-left: v-bind(`solid ${xBorder}px #59893d`);
  border-right: v-bind(`solid ${xBorder}px #59893d`);
  border-top: v-bind(`solid ${yBorder}px #59893d`);
  border-bottom: v-bind(`solid ${yBorder}px #59893d`);
}
.grid-item{
  width: v-bind(`${size}px`);
  height:v-bind(`${size}px`);
  background-color: #fff;
  position: relative;
}

.grid-item.odd{
  background-color: #ACD661;
}

.grid-item.even{
  background-color: #A4D05A;
}

.grid-item.snake{
  background-color: red;
}

.grid-item.food{
  background-color: blue;
}

.grid-item.head{
  display: flex;
  flex-direction:v-bind(directionStyle);
  justify-content: center;
  align-items:center;
}

.head::before{
  content:'';
  display: inline-block;
  height: 5px;
  width: 5px;
  border-radius: 9999px;
  background-color: yellow!important;
  margin: 2px;
}
.head::after{
  content:'';
  display: inline-block;
  height: 5px;
  width: 5px;
  border-radius: 9999px;
  margin: 2px;
  background-color: yellow!important;
}
</style>

<route lang="json">
  {
    "style":{
      "navigationBarTitleText": "贪吃蛇"
    },
    "meta":{}
  }
</route>
