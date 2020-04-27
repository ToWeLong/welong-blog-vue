<template>
  <div>
    <div class="view-title">
      <span>新增用户</span>
    </div>
    <el-card class="edit-card">
      <el-form :model="form" label-position="right" label-width="80px" class="tag_form">
        <el-form-item label="昵称:">
          <el-input style="width:400px" clearable v-model="form.nickname" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input style="width:400px" clearable v-model="form.account" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input style="width:400px" clearable v-model="form.password" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="所在组">
          <el-select v-model="group_form" placeholder="请选择" @change="changeValue">
            <el-option
              v-for="item in groups"
              :value="item.id"
              :key="item.id"
              :label="item.group_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="success">添加用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Group from "@/services/models/group";
import User from "@/services/models/user";
import Utils from "@/services/utils/util";
export default {
  created() {
    this.success = Utils.throttle(this.addUser, this.wait);
  },
  data() {
    return {
      loading: false,
      wait: 2000,
      success: null,
      form: {
        nickname: "",
        account: "",
        password: "",
        group_id: ""
      },
      groups: [],
      group_form: [],
    };
  },
  
  async updated () {
    let data = await Group.getGroupAll();
    this.groups = data;
  },
  methods: {
    changeValue(val) {
      this.form.group_id = val;
    },
    async addUser() {
      const { nickname, account, password, group_id } = this.form;
      console.log(nickname, account, password, group_id)
      try {
        this.loading = true;
        await User.addUser(nickname, account, password, group_id);
        this.loading = false;
        this.$router.push("/author/list");
        this.$message.success("添加成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
}
.edit-card {
  margin: 16px;
}
</style>