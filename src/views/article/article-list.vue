<template>
  <div>
    <div v-if="switchEdit">
      <div class="view-title">
        <span>文章列表</span>
      </div>
      <el-card class="card-main">
        <el-table
          :data="tableData"
          style="width: 100%"
          class="table"
          :cell-style="cellStyle"
          :header-cell-style="rowClass"
        >
          <el-table-column label="id" prop="id" width="80"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img class="article-img" :src="scope.row.image" />
            </template>
          </el-table-column>
          <el-table-column label="文章名" prop="title"></el-table-column>
          <el-table-column label="文章描述" prop="description"></el-table-column>
          <el-table-column label="点赞数" prop="like" width="80"></el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <el-switch
                @change="changeStatus(scope.row.id,scope.row.status)"
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="访问数" prop="views" width="80"></el-table-column>
          <el-table-column label="创建时间" prop="create_time" :formatter="dateFormatterCreatedTime"></el-table-column>
          <el-table-column label="修改时间" prop="update_time" :formatter="dateFormatterUpdatedTime"></el-table-column>
          <el-table-column label="删除时间" prop="delete_time" :formatter="dateFormatterDeletedTime"></el-table-column>
          <el-table-column align="right" fixed="right">
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
    <ArticleInfo
      v-else
      :infoType="infoType"
      :articleList="articleList"
      :tagName="tag_name"
      @editClose="editClose"
    ></ArticleInfo>
  </div>
</template>

<script>
import Article from "@/services/models/article";
import ArticleInfo from "./article-info";
import Tag from "@/services/models/tag";
export default {
  components: {
    ArticleInfo
  },
  async mounted() {
   this.getAll()
  },
  data() {
    return {
      tableData: [],
      switchEdit: true,
      articleList: {},
      infoType: "",
      tag_name: "",
      page:1,
      total:1,
      count:5
    };
  },
  methods: {
    async getAll() {
      const res = await Article.getAll(this.page, 5);
      this.tableData = res.items;
      this.total = res.total
      this.count = res.count
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
    async onPageClick(val) {
      this.page = (val-1) * this.count
      this.getAll()
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
    async editClose() {
      this.switchEdit = true;
      this.getAll()
    },
    async handleEdit(data) {
      this.articleList = data;
      let res = await Tag.getTagIdByArticleId(this.articleList.id);
      let tag_name = res.tag.tag_name;
      // console.log(tag_name);
      
      this.tag_name = tag_name;
      this.switchEdit = false;
      this.infoType = "edit";
    },
    async handleDelete(id) {
      try {
        await Article.deleteArticle(id);
        this.getAll()
        this.$message.success("删除成功！");
      } catch (error) {
        console.log(error);
      }
    },
    async changeStatus(id, status) {
      try {
        if (status) {
          await Article.updateStatus(id, 1);
        } else {
          await Article.updateStatus(id, 0);
        }
        this.getAll()
        console.log(id);
        console.log(status);
        this.$message.success("更改状态成功");
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
  width: 98%;
  margin: 10px auto;
  font-size: 30px;
}
.article-img {
  max-width: 100%;
  max-height: 100%;
}
.page {
  float: right;
  height: 40px !important;
  margin: 10px auto;
}
</style>