<template>
  <div v-if="!isShow">
    <div class="view-title">
      <span>编辑标签</span>
      <el-button class="btn_back" type="primary" @click="back">返回</el-button>
    </div>
    <el-card class="edit-card">
      <el-form :model="form" label-position="right" label-width="80px" class="tag_form">
        <el-form-item label="ID:">
          <el-input :disabled="true" style="width:400px" clearable v-model="form.id" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="标签名:">
          <el-input style="width:400px" clearable v-model="form.tag_name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="success">编辑标签</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Tag from "@/services/models/tag";
import Utils from "@/services/utils/util";
export default {
  beforeUpdate() {
    this.form = this.tagList;
  },
  props: ["tagList", "editClose", "isShow"],
  data() {
    return {
      form: {
        id: 0,
        tag_name: ""
      },
      loading: false,
      wait: 2000,
      success: null,
    };
  },
  methods: {
    back() {
      this.$emit("editClose");
    },
    async editTag(){
      const {id,tag_name} = this.form
      try {
        this.loading = true;
        await Tag.edit(id,tag_name);
        this.loading = false;
         this.$emit('editClose')
        this.$message.success("编辑成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  },
  created(){
    this.success = Utils.throttle(this.editTag, this.wait);
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
  position: relative;
  .btn_back {
    position: absolute;
    right: 10px;
    top: 8px;
  }
}
.edit-card{
  margin: 16px;
}
</style>