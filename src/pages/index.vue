<script setup lang="ts">
const router = useRouter()
const appList = [{
  title: '口算练习',
  icon: 'icon-svg:calculation',
  backgroundColor: '#3ABEF9',
  url: '/pages/calculation-practise/index',
}, {
  title: '口算试卷',
  icon: 'icon-svg:calculation',
  backgroundColor: '#3ABEF9',
  url: '/pages/calculation-export/index',
}, {
  title: '舒尔特方格',
  icon: 'icon-svg:shulte',
  backgroundColor: '#10aec2',
  url: '/pages/shulte/index',
}, {
  title: '贪吃蛇',
  icon: 'icon-svg:snake',
  backgroundColor: '#10aec2',
  url: '/pages/snake/index',
}, {
  title: '时钟',
  icon: 'icon-svg:time',
  backgroundColor: '#10aec2',
  url: '/pages/timer/index',
}, {
  title: '诗词',
  icon: 'icon-svg:poetry',
  backgroundColor: '#10aec2',
  url: '/pages/poetry/index',
}, {
  title: '记忆翻牌',
  icon: 'icon-svg:memory-card',
  backgroundColor: '#10aec2',
  url: '/pages/memory-card/index',
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
