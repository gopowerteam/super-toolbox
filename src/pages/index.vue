<script setup lang="ts">
const router = useRouter()

function push() {
  router.push('/pages/page1/index', {
    query: {
      a: 123,
    },
    params: {
      b: true,
    },
  })
}
</script>

<template>
  <PageContainer append-class="space-y-2">
    <!-- PAGE -->
    <NutButton type="primary" @click="push">
      push
    </NutButton>
  </PageContainer>
</template>

<route lang="json">
  {
    "layout": "default",
    "meta":{
    }
  }
</route>
