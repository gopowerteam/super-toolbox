<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = withDefaults(defineProps<{
  padding?: boolean | string
  appendClass?: string
  appendStyle?: CSSProperties
}>(), {
  padding: true,
})

const defaultConfigs = {
  styles: {
    padding: '20rpx',
  },
}

const styles = {
  padding: () => {
    switch (true) {
      case props.padding === true:
        return { padding: defaultConfigs.styles.padding }
      case typeof props.padding === 'string' :
        return { padding: props.padding }
      default:
        return { padding: 0 }
    }
  },
}

const containerStyle = computed<CSSProperties>(() => {
  return {
    ...styles.padding(),
  }
})

const containerClass = computed(() => {
  return props.appendClass
})
</script>

<template>
  <view class="page-container" :style="containerStyle" :class="containerClass">
    <div>123</div>
    {{ appendClass }}
    <slot />
  </view>
</template>

<style scoped>
</style>
