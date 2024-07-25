<script setup lang="ts">
const router = useRouter()
const speed = $ref(3)

function onSubmit() {
  router.push('/pages/snake/game', {
    query: {
      speed,
    },
  })
}
</script>

<template>
  <PageContainer append-class="space-y-10">
    <view class="space-y-2">
      <view class="card-style bg-#fff space-y-1">
        <view class="title">
          游戏难度:
        </view>
        <view class="grid grid-cols-3">
          <view v-for="index in 9" :key="index" @click="() => speed = index">
            <view class="type-item" :class="{ active: speed === index }">
              {{ index }}
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

<style scope lang="scss">
.title{
  font-weight: bold;
  font-size: 32rpx;
  padding: 10rpx 20rpx;
}

.type-item,
.range-item,
.count-item{
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
    "style":{
      "navigationBarTitleText": "贪吃蛇"
    },
    "meta":{}
  }
</route>
