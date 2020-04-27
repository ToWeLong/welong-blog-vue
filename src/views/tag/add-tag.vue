<template>
  <div>
    <div class="view-title">
      <span>新增标签</span>
    </div>
    <el-card class="add-card">
      <el-form :model="form" class="tag_form">
        <el-form-item label="标签名:">
          <el-input style="width:400px" clearable v-model="form.tag_name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="success">添加标签</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Tag from "@/services/models/tag";
import Utils from "@/services/utils/util";
export default {
  data() {
    return {
      loading: false,
      wait: 2000,
      success: null,
      form: {
        tag_name: ""
      }
    };
  },
  methods: {
    async addTag() {
      const { tag_name } = this.form;
      try {
        this.loading = true;
        await Tag.addTag(tag_name);
        this.loading = false;
        this.$router.push("/tag/manager");
        this.$message.success("添加成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
  },
  created(){
      this.success = Utils.throttle(this.addTag, this.wait);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
}
.add-card{
  margin: 16px;
}
</style>