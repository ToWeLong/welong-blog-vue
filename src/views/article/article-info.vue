<template>
  <div>
    <div class="view-title">
      <span>{{infoType === 'add' ? '添加文章' : '编辑文章'}}</span>
      <span v-if="infoType === 'edit'" class="back" @click="$emit('editClose', false)">
        <i class="el-icon-back"></i>
        返回
      </span>
    </div>
    <div class="card">
      <el-card class="add-card">
        <el-form :model="form" label-position="right" label-width="80px">
          <el-form-item label="ID:" v-if="infoType!='add'">
            <el-input
              :disabled="true"
              style="width:400px"
              clearable
              v-model="form.id"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="文章名:">
            <el-input style="width:400px" clearable v-model="form.title" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="描述:">
            <el-input style="width:400px" clearable v-model="form.description" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="图片URL:">
            <el-input style="width:400px" clearable v-model="form.image" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="内容:">
            <el-input
              type="textarea"
              rows="8"
              style="width:400px"
              clearable
              v-model="form.content"
              placeholder="请输入内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签:" v-if="infoType === 'add'">
            <el-select v-model="editTags" placeholder="请选择" @change="changeTag">
              <el-option
                v-for="item in tags"
                :value="item.id"
                :key="item.id"
                :label="item.tag_name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签:" v-if="infoType != 'add'">
            <el-select v-model="tag_name" placeholder="请选择" @change="editArticleTag">
              <el-option
                v-for="item in tags"
                :value="item.id"
                :key="item.id"
                :label="item.tag_name"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="infoType==='add'">
            <el-button type="primary" @click="success">添加文章</el-button>
          </el-form-item>
          <el-form-item v-if="infoType!='add'">
            <el-button type="primary" @click="successEdit">编辑文章</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import Tag from "@/services/models/tag";
import Article from "@/services/models/article";
import Utils from "@/services/utils/util";
export default {
  props: {
    infoType: {
      type: String,
      default: "add"
    },
    articleList: {
      type: Object,
      default: () => {}
    },
    editClose: {
      type: Function
    },
    tagName: {
      type: String
    }
  },
  async created() {
    if (this.infoType != "add") {
      this.form = this.articleList;
      this.tag_name = this.tagName
    }
    if (this.infoType === "add") {
      this.success = Utils.throttle(this.addArticle, this.wait);
    }
    if (this.infoType != "add") {
      this.successEdit = Utils.throttle(this.editArticle, this.wait);
    }
    // 取标签列表给编辑或者添加的页面
    const resTag = await Tag.getAllFilter();
    this.tags = resTag;
  },
  data() {
    return {
      form: {
        title: "",
        description: "",
        image: "",
        content: "",
        tag_id: ""
      },
      tags: [],
      tag_name: null,
      editTags: [],
      loading: false,
      wait: 2000,
      success: null,
      successEdit: null
    };
  },
  methods: {
    changeTag(val) {
      console.log(val);
      this.form.tag_id = val;
    },
    editArticleTag(val) {
      console.log(val);
      this.form.tag_id = val;
    },
    async addArticle() {
      const { title, description, image, content, tag_id } = this.form;
      console.log(tag_id);
      try {
        this.loading = true;
        await Article.addArticle(title, description, image, content, tag_id);
        this.loading = false;
        this.$router.push("/article/list");
        this.$message.success("添加成功！");
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },
    async editArticle() {
      const { id, title, description, image, content, tag_id } = this.form;
      try {
        this.loading = true;
        await Article.updateArticle(
          id,
          title,
          description,
          image,
          content,
          tag_id
        );
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
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixin.scss";
.view-title {
  @include view-common-title;
  justify-content: space-between;
  cursor: pointer;
}
.card {
  .add-card {
    margin: 16px;
  }
}
</style>