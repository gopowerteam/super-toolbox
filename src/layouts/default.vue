<script setup lang="ts">
const envResult = $(useEnv())
</script>

<template>
  <view v-if="envResult.platform.isWeb">
    <template v-if="!envResult.device.isMobile">
      <view class="flex-center fixed inset-0 bg-#999">
        <view class="w-750rpx h-1623rpx bg-#fff relative">
          <slot />
        </view>
      </view>
    </template>
    <template v-else>
      <slot />
    </template>
  </view>
</template>

<style scoped>

</style>
