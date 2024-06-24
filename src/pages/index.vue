<script setup lang="ts">
</script>

<template>
  <view>
    <NutButton type="primary">
      主要按钮123
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
    <view css:text-red>
      123123
    </view>
    <div>123</div>
    <i class="icon-svg:user" css:text-blue />
  </view>
</template>

<route lang="json">
  {
    "layout": "default",
    "meta":{
      "authLogin": true
    }
  }
</route>
