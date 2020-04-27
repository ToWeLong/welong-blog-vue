<template>
  <div v-if="!isShow">
    <div class="view-title">
      <span>{{infoType === 'add' ? '添加分组' : '编辑分组'}}</span>
      <span v-if="infoType === 'edit'" class="back" @click="$emit('editClose', false)">
        <i class="el-icon-back"></i>
        返回
      </span>
    </div>
    <el-card class="add-card">
      <el-form :model="form" label-position="right" label-width="80px">
        <el-form-item v-if="infoType!='add'" label="ID:">
          <el-input :disabled="true" style="width:400px" clearable v-model="form.id" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="分组名:">
          <el-input style="width:400px" clearable v-model="form.group_name" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item label="权限数字:">
          <el-input style="width:400px" clearable v-model="form.scope" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item v-if="infoType==='add'">
          <el-button type="primary" @click="success">添加分组</el-button>
        </el-form-item>
        <el-form-item v-if="infoType!='add'">
          <el-button type="primary" @click="success">编辑分组</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Group from "@/services/models/group";
import Utils from "@/services/utils/util";
export default {
  props: {
    infoType: {
      type: String,
      default: "add"
    },
    isShow: {
      type: Boolean
    },
    groupList: {
      type: Object,
      default: () => {}
    },
    editClose: {
      type: Function
    }
  },
  data() {
    return {
      loading: false,
      wait: 2000,
      success: null,
      form: {
        tag_name: "",
        scope: ""
      }
    };
  },
  async updated() {
    if (this.infoType != "add") {
      this.form = this.groupList;
    }
  },
  methods: {
    async addGroup() {
      const { group_name, scope } = this.form;
      try {
        this.loading = true;
        await Group.addGroup(group_name, scope);
        this.loading = false;
        this.$router.push("/group/list");
        this.$message.success("添加成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    async editGroup() {
      const { id, group_name, scope } = this.form;
      try {
        this.loading = true;
        await Group.editGroup(group_name, scope, id);
        this.loading = false;
        this.$emit("editClose");
        this.$message.success("编辑成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  },
  created() {
    if (this.infoType === "add") {
      this.success = Utils.throttle(this.addGroup, this.wait);
    }
    if (this.infoType != "add") {
      this.success = Utils.throttle(this.editGroup, this.wait);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
  justify-content: space-between;
  cursor: pointer;
}
.add-card {
  margin: 16px;
}
</style>