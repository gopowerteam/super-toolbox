<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app'
import { bootstrap } from './bootstrap'

onLaunch(() => {
  bootstrap()
})
</script>

<style lang="scss">
@import "@/styles/index.scss";
@import 'nutui-uniapp/styles/index.scss';
</style>
