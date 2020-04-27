<template>
  <div v-if="!isShow">
    <div class="view-title">
      <span>编辑用户</span>
      <el-button class="btn_back" type="primary" @click="back">返回</el-button>
    </div>
    <el-card class="edit-card">
      <el-form :model="form" label-position="right" label-width="80px" class="tag_form">
        <el-form-item label="ID:">
          <el-input :disabled="true" style="width:400px" clearable v-model="form.id" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="昵称:">
          <el-input  style="width:400px" clearable v-model="form.nickname" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="用户名:">
          <el-input style="width:400px" clearable v-model="form.account" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input style="width:400px" clearable v-model="form.password1" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="所在组">
          <el-select v-model="setDefaultValue" placeholder="请选择">
            <el-option
              v-for="item in form.groups"
              :value="item.id"
              :key="item.id"
              :label="item.group_name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="success">编辑用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Group from "@/services/models/group";
import User from "@/services/models/user";
import { isEmpty } from "@/services/utils/string";
import Utils from "@/services/utils/util";
export default {
  data() {
    return {
      form: {
        nickname: "",
        account: "",
        group: "",
        group_name: "",
        password1: ""
      },
      groups: [],
      loading: false,
      wait: 2000,
      success: null
    };
  },
  async mounted() {
    let data = await Group.getGroupAll();
    this.groups = data;
  },
  updated() {
    this.setInfo();
  },
  computed: {
    setDefaultValue: {
      get() {
        return this.form.group_name;
      },
      set(val) {
        this.form.group_name = val;
        console.log("val:" + val);
        this.form.group_id = val;
      }
    }
  },
  props: ["userList", "editClose", "isShow"],
  created(){
    this.success = Utils.throttle(this.editUsers, this.wait);
  },
  methods: {
    back() {
      this.$emit("editClose");
    },
    setInfo() {
      this.form = this.userList;
      this.form.groups = this.groups;
    },
    async editUsers() {
      //  id,account,password,group_id,nickname,
      const { id, account, nickname, group_id } = this.form;
      let password = this.form.password1;
      if (isEmpty(password)) {
        password = "";
      }
      if (typeof group_id == "undefined" && typeof group_id == "undefined") {
        let gid = this.groups.find(
          item => item.group_name === this.form.group_name
        ).id;
        console.log(id, account, password, gid, nickname);
        try {
          this.loading = true;
          await User.editUser(id, account, password, gid, nickname);
          this.loading = false;
          this.$emit("editClose");
          this.$message.success("编辑成功！");
        } catch (e) {
          this.loading = false;
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }
      if (!isEmpty(group_id)) {
        console.log(id, account, password, nickname, group_id);
        try {
          this.loading = true;
          await User.editUser(id, account, password, group_id, nickname);
          this.loading = false;
          this.$emit("editClose");
          this.$message.success("编辑成功！");
        } catch (e) {
          this.loading = false;
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }
    }
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
.edit-card {
  margin: 16px;
}
</style>