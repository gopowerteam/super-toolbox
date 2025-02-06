<script setup lang="ts">
import { computed } from 'vue'
import { patterns } from '@/config/pattern.config'

const props = defineProps<{
  value: number
  count?: number
}>()

const pattern = computed(() => {
  return patterns[(props.value - 1) % patterns.length]
})

// 根据卡片数量计算图标尺寸
const size = computed(() => {
  const baseSize = 64
  const count = props.count || 16
  const scale = 1 - count / 8 / 10 // 每增加8张卡片，尺寸减小10%
  return `${baseSize * scale}rpx`
})
</script>

<template>
  <view class="pattern-icon">
    <image
      class="pattern-image"
      :src="pattern"
      mode="aspectFit"
      :style="{
        width: size,
        height: size,
      }"
    />
  </view>
</template>

<style scoped>
.pattern-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pattern-image {
  display: block;
}
</style>
