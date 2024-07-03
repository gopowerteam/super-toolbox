<script setup lang="ts">
const router = useRouter()
const appList = [{
  title: '口算练习',
  icon: 'icon-svg:calculation',
  backgroundColor: '#3ABEF9',
  url: '/pages/calculation-practise/index',
}, {
  title: '舒尔特方格',
  icon: 'icon-svg:shulte',
  backgroundColor: '#10aec2',
  url: '/pages/shulte/index',
}]
</script>

<template>
  <PageContainer append-class="space-y-2">
    <view
      v-for="item in appList"
      :key="item.title"
      :style="{ backgroundColor: item.backgroundColor }"
      class="card-style relative card-item flex justify-between  items-center"
      @click="() => router.push(item.url)"
    >
      <text class="title">
        {{ item.title }}
      </text>
      <view class="icon" :class="item.icon" />
    </view>
  </PageContainer>
</template>

<style scope lang="scss">
.card-item{
  height: 200rpx;

  .title{
    color:#fff;
    font-size: 64rpx;
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
