<script setup lang="ts">
const router = useRouter()

let query = $ref<AnyObject>()
let params = $ref<AnyObject>()

onPageLoad(() => {
  query = router.query
  params = router.params
})
</script>

<template>
  <PageContainer>
    <view class="text-#333">
      <view>page1</view>
      <view>query: {{ query }}</view>
      <view>params: {{ params }}</view>
    </view>
  </PageContainer>
</template>

<style scoped>

</style>
