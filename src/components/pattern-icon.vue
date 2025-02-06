<script setup lang="ts">
import { computed } from 'vue'
import { patterns } from '@/config/pattern.config'

const props = defineProps<{
  value: number
}>()

const pattern = computed(() => {
  return patterns[(props.value - 1) % patterns.length]
})
</script>

<template>
  <view class="pattern-icon">
    <image
      class="pattern-image"
      :src="pattern"
      mode="aspectFit"
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
  font-size: calc(64rpx - var(--card-count, 16) / 8 * 1rpx);
  width: 70%;
  height: 70%;
}
</style>
