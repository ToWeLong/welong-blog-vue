<template>
  <div>
    <div v-if="switchEdit">
      <div class="view-title">
        <span>用户列表</span>
      </div>
      <el-card class="card-main">
        <el-table
          :data="tableData"
          style="width: 100%"
          class="table"
          :cell-style="cellStyle"
          :header-cell-style="rowClass"
        >
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="昵称" prop="nickname"></el-table-column>
          <el-table-column label="用户名" prop="account"></el-table-column>
          <el-table-column label="所在分组" prop="group_name"></el-table-column>
          <el-table-column label="创建时间" prop="create_time" :formatter="dateFormatterCreatedTime"></el-table-column>
          <el-table-column label="修改时间" prop="update_time" :formatter="dateFormatterUpdatedTime"></el-table-column>
          <el-table-column label="删除时间" prop="delete_time" :formatter="dateFormatterDeletedTime"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="page"
          :hide-on-single-page="true"
          background
          layout="prev, pager, next"
          @current-change="onPageClick"
          :total="total"
          :page-size="count"
        ></el-pagination>
      </el-card>
    </div>
    <AuthorEdit :isShow="switchEdit" :userList="userList" @editClose="editClose"></AuthorEdit>
  </div>
</template>

<script>
import User from "@/services/models/user";
import AuthorEdit from "./author-edit";
export default {
  components: {
    AuthorEdit
  },
  async mounted() {
    await this.getUser();
  },
  data() {
    return {
      tableData: [],
      switchEdit: true,
      userList: null,
      totlePage: 0,
      page: 1,
      total: 1,
      count: 5
    };
  },
  methods: {
    async onPageClick(val) {
      this.page = (val - 1) * this.count;
      this.getUser();
    },
    dateFormatter(row) {
      let datetime = row;
      if (datetime) {
        datetime = new Date(datetime);
        let y = datetime.getFullYear() + "-";
        let mon = datetime.getMonth() + 1 + "-";
        let d = datetime.getDate();
        return y + mon + d;
      }
      return "--";
    },
    dateFormatterCreatedTime(row) {
      return this.dateFormatter(row.create_time);
    },
    dateFormatterUpdatedTime(row) {
      return this.dateFormatter(row.update_time);
    },
    dateFormatterDeletedTime(row) {
      return this.dateFormatter(row.delete_time);
    },
    cellStyle() {
      return "text-align:center";
    },
    rowClass() {
      return "text-align:center";
    },
    async getUser() {
      const res = await User.getAll(this.page, 5);
      this.tableData = res.items;
      this.total = res.total;
      this.count = res.count;
      res.items.forEach(async (element, index) => {
        let uid = element.id;
        let data = await User.getUserInfoByUid(uid);
        res.items[index].group_name = data.group.group_name;
      });
    },
    async editClose() {
      this.switchEdit = true;
      await this.getUser();
    },
    handleEdit(data) {
      this.userList = data;
      this.switchEdit = false;
    },
    async handleDelete(id) {
      try {
        await User.deleteUser(id);
        await this.getUser();
        this.$message.success("删除成功！");
      } catch (error) {
        console.log(error);
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
.card-main {
  width: 90%;
  margin: 20px auto;
  font-size: 30px;
}
.page {
  float: right;
  height: 40px !important;
  margin: 10px auto;
}
</style>