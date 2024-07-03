<script setup lang="ts">
function onRedirect() {
  uni.navigateTo({
    url: '/pages/calculation-practise/index',
  })
}
</script>

<template>
  <PageContainer append-class="space-y-2">
    <view
      class="card-style relative card-item flex justify-between  items-center"
      @click="onRedirect"
    >
      <text class="title">
        口算
      </text>
      <view class="icon icon-svg:calculation" />
    </view>
  </PageContainer>
</template>

<style scope lang="scss">
.card-item{
  background-color: #3ABEF9;
  height: 200rpx;

  .title{
    color:#fff;
    font-size: 72rpx;
    margin-left: 20rpx;
  }
  .icon{
    font-size: 120rpx;
    color: rgba(#fff,0.5);
  }
}
</style>

<route lang="json">
  {
    "layout": "default",
    "meta":{
    }
  }
</route>
