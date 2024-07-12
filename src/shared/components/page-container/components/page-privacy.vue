<script setup lang="ts">
import { appConfig } from '@/config/app.config'

const title = $ref(appConfig.title)
let visiable = $ref(false)
let resolvePrivacyAuthorization: (data: {
  buttonId: string
  event: string
}) => void

onMounted(() => {
  wx.onNeedPrivacyAuthorization((resolve: any) => {
    resolvePrivacyAuthorization = resolve
    visiable = true
  })
})

function openPrivacyContract() {
  wx.openPrivacyContract({})
}

function onAgreePrivacyAuthorization() {
  if (resolvePrivacyAuthorization) {
    resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
    visiable = false
  }
}
</script>

<template>
  <view class="page-privacy">
    <NutDialog v-model:visible="visiable" no-footer custom-class="p-0! my--40rpx">
      <view class="modal-container">
        <view class="content space-y-10 pt-2 w-full">
          <view class="space-y-8">
            <view class="title text-center">
              {{ title }}
            </view>
            <view class="description">
              <span>在你使用【{{ title }}】服务之前，请仔细阅读</span>
              <span class="text-[#17C0FB]" @click="openPrivacyContract">
                《{{ title }}隐私保护指引》
              </span>
              <span>如你同意《{{ title }}隐私保护指引》,请点击“同意”开始使用【{{ title }}】</span>
            </view>
          </view>
          <view class="actions">
            <button class="action-btn left" @click="() => (visiable = false)">
              拒绝
            </button>
            <button
              id="agree-btn"
              class="action-btn right"
              open-type="agreePrivacyAuthorization"
              style="color: #17C0FB;"
              @agreeprivacyauthorization="onAgreePrivacyAuthorization"
            >
              同意
            </button>
          </view>
        </view>
      </view>
    </NutDialog>
  </view>
</template>

<style lang="scss">
.page-privacy {
  .nut-dialog{
    display: none!important;
  }
  .nut-dialog__content{
    margin:0!important;
  }
}
</style>

<style lang="scss" scoped>
.page-privacy {
  .modal-container {
    width: 100%;
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx 0 0 0;
    position: relative;
  }

  .header {
    position: absolute;
    left: 0;
    right: 0;
    top: -180rpx;
    height: 180rpx;
    text-align: center;

    .image {
      height: 180rpx;
    }
  }

  .content {
    .title {
      font-size: 36rpx;
      font-weight: bold;
    }

    .description {
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.5);
      padding: 0 20px;

      .link {
        color: #5bbaf7;
      }
    }

    .actions {
      display: flex;
      justify-content: space-evenly;
      align-items: center;

      .action-btn {
        flex: 1;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 30rpx;
        background-color: #fff;

        border: solid 1px #eaeaea;
        border-radius: 0;
        border-bottom-color: transparent;

        &.left {
          border-left-color: transparent;
        }

        &.right {
          border-right-color: transparent;
        }

        &::after {
          border: none!important;
        }
      }

    }

    .agree {
      color: #5bbaf7;
    }

    .disagree {
      color: #999990;
    }
  }
}
</style>
