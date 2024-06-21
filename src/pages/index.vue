<script setup lang="ts">
import AppLogos from '@/components/AppLogos.vue'
import InputEntry from '@/components/InputEntry.vue'
import AppFooter from '@/components/AppFooter.vue'
import 'nutui-uniapp/styles/index.scss'
</script>

<template>
  <view px-10 py-20 text-center>
    <NutButton type="primary">
      主要按钮
    </NutButton>
    <NutButton type="info">
      信息按钮
    </NutButton>
    <NutButton type="default">
      默认按钮
    </NutButton>
    <NutButton type="danger">
      危险按钮
    </NutButton>
    <NutButton type="warning">
      警告按钮
    </NutButton>
    <NutButton type="success">
      成功按钮
    </NutButton>

    <AppLogos />
    <InputEntry />
    <AppFooter />
  </view>
</template>
