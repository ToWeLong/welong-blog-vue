<template>
  <div>
    <div v-if="switchEdit">
      <div class="view-title">
        <span>分组列表</span>
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
          <el-table-column label="分组名" prop="group_name"></el-table-column>
          <el-table-column label="权限数字" prop="scope"></el-table-column>
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
      </el-card>
    </div>
    <group-info :isShow="switchEdit" :infoType="infoType" :groupList="groupList" @editClose="editClose"></group-info>
  </div>
</template>

<script>
import Group from "@/services/models/group";
import GroupInfo from "./group-info";
export default {
  components: {
    GroupInfo
  },
  async created() {
    this.tableData = await Group.getGroups();
  },
  data() {
    return {
      tableData: [],
      switchEdit: true,
      infoType: "",
      groupList: {
        id: "",
        tag_name: ""
      }
    };
  },
  methods: {
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
    handleEdit(data) {
      console.log(data);
      this.groupList = data;
      this.switchEdit = false;
      this.infoType = 'edit'
    },
    async handleDelete(id){
      try {
        await Group.deleteGroup(id)
        this.tableData = await Group.getGroups();
        this.$message.success("删除成功！");
      } catch (error) {
        console.log(error);
        
      }
    },
    async editClose() {
      this.switchEdit = true;
      this.tableData = await Group.getGroups();
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
</style>