<template>
  <div class="box">
    <div class="view-title">
      <span>全局设置</span>
    </div>
    <div class="main">
      <el-button type="primary" @click="test()">测试token</el-button>
    </div>
  </div>
</template>

<script>
import User from '@/services/models/user'
export default {
    methods:{
        async test(){
            await User.getRefreshToken();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
}
</style>