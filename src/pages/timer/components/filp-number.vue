<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
}>(), {
  value: 0,
})

let count = $ref(props.value)
let nextCount = $ref<number>()
let isFlipping = $ref(false)

watch(() => props.value, (value) => {
  nextCount = value

  flipDown()
}, {
  deep: true,
})

function flipDown() {
  if (isFlipping) {
    return
  }

  isFlipping = true

  setTimeout(() => {
    isFlipping = false
    count = unref(nextCount!)
  }, 600)
}

// function onUp() {

// }
</script>

<template>
  <view class="flip down" :class="{ go: isFlipping }">
    <!-- 位于后面的纸牌 -->
    <view class="digital back" :class="`number-${nextCount}`" />
    <!-- 位于前面的纸牌 -->
    <view class="digital front" :class="`number-${count}`" />
  </view>
</template>

<style lang="scss" scoped>
.flip {
    display: inline-block;
    position: relative;
    width: 400rpx;
    height: 400rpx;
    line-height: 400rpx;
    border: solid 1px #000;
    border-radius: 20rpx;
    background: transparent;
    font-size: 264rpx;
    color: #efefef;
    box-shadow: 0 0 12rpx rgba(0, 0, 0, .5);
    text-align: center;
    font-family: "Helvetica Neue"
}

.flip .digital:before,
.flip .digital:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    background: #000;
    overflow: hidden;
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
}

.flip .digital:before {
    top: 0;
    bottom: 50%;
    border-radius: 20rpx 20rpx 0 0;
    border-bottom: solid 2rpx #666;
}

.flip .digital:after {
    top: 50%;
    bottom: 0;
    border-radius: 0 0 20rpx 20rpx;
    line-height: 0;
}

@for $i from 0 through 9 {
  .flip .digital.number-#{$i}:before,
  .flip .digital.number-#{$i}:after{
   content: "0#{$i}";
  }
}

@for $i from 10 through 60 {
  .flip .digital.number-#{$i}:before,
  .flip .digital.number-#{$i}:after{
   content: "#{$i}";
  }
}

.flip .front:before{
  z-index: 3;
}
.flip .back:after{
  z-index: 2;
  transform-origin: 50% 0;
  transform: perspective(640rpx) rotateX(180deg);
}

.flip .front:after,
.flip .back:before {
    z-index: 1;
}

.flip.go .front:before{
  transform-origin: 50% 100%;
  animation: frontFilpDown 0.6s ease-in-out both ;
  box-shadow: 0 -4rpx 12rpx rgba(255,255,255,0.6);
  backface-visibility: hidden;
}

.flip.go .back:after{
  transform-origin: 50% 0;
  animation: backFilpDown 0.6s ease-in-out both;
}

@keyframes frontFilpDown {
  0%{
    transform: perspective(640rpx) rotateX(0deg);
  }
  100%{
    transform: perspective(640rpx) rotateX(-180deg);
  }
}

@keyframes backFilpDown {
  0%{
    transform: perspective(640rpx) rotateX(180deg);
  }
  100%{
    transform: perspective(640rpx) rotateX(0deg);
  }
}
</style>
