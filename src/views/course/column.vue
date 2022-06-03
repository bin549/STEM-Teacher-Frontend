<template>
  <div class="app-container">
      <BaseDialog
        :show="!!serialNumber"
        title="课程序列号"
        :content="serialNumber"
        @close="handleSerialNumberVisible"
      ></BaseDialog>
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between;"
    >
    <el-button
      class="filter-item"
      style="margin-left: 10px;"
      type="primary"
      icon="el-icon-edit"
      @click="handleCreate"
    >
      新增课程
    </el-button>
    <div>
      <el-select
        v-model="listQuery.genre"
        placeholder="课程类型"
        clearable
        style="width: 120px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="(item, k) in genresList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          />
        </el-select>
          <el-select
            v-model="listQuery.status"
            placeholder="是否上架"
            clearable
            style="width: 120px; margin-right: 10px"
            class="filter-item"
          >
            <el-option
              v-for="(item, k) in statusList"
              :key="k"
              :label="item"
              :value="k"
              />
            </el-select>
        <!-- <el-input
          v-model="listQuery.title"
          placeholder="标题"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        /> -->
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          搜索
        </el-button>
    </el-select>
  </div>
  </div>
  <el-table
    :key="tableKey"
    v-loading="listLoading"
    :data="list"
    border
    fit
    highlight-current-row
    style="width: 100%"
    @sort-change="sortChange"
  >
  <el-table-column
    label="ID"
    prop="id"
    sortable="custom"
    align="center"
    width="80"
    :class-name="getSortClass('id')"
  >
  <template slot-scope="{ row, $index }">
      <span>{{ $index +1 }}</span>
    </template>
  </el-table-column>
  <el-table-column label="课程标题" min-width="250px">
    <template slot-scope="{ row }">
      <div style="display: flex">
        <img
          :src="row.get_image"
          class="pre-image"
          @click="previewLecture(row.get_image)"
        />
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <span>{{ row.title }}</span>
        </div>
      </div>
    </template>
  </el-table-column>
  <el-table-column label="课程内容" min-width="340px">
    <template slot-scope="{ row }">
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    >
      <span>{{ row.description }}</span>
    </div>
    </template>
  </el-table-column>
  <el-table-column label="课程类型" min-width="80px">
    <template slot-scope="{ row }">
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      "
    >
    <el-tag type="info">
        <span>{{ row.genre | genreNameFilter }}</span>
    </el-tag>
    </div>
    </template>
  </el-table-column>
  <el-table-column label="课程状态" class-name="status-col" width="80">
    <template slot-scope="{ row }">
      <el-tag :type="row.is_visible ? 'success' : 'danger'">
        {{ row.is_visible | statusFilter }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="课程价格" class-name="status-col" width="80">
    <template slot-scope="{ row }">
      <el-tag type="default">
        $ {{ row.price }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="选课人数" class-name="status-col" width="80">
    <template slot-scope="{ row }">
      <el-tag type="default">
          {{ row.id | studentCountFilter }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="课时数量" class-name="status-col" width="80">
    <template slot-scope="{ row }">
      <el-tag type="default">
          {{ row.id | lectureCountFilter }}
      </el-tag>
    </template>
  </el-table-column>
  <el-table-column label="创建时间" width="170px" align="center">
    <template slot-scope="{ row }">
        <span>{{
          row.created_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
        }}</span>
    </template>
  </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="openDetail(row)">
              目录
            </el-button>
            <el-button size="mini" @click="checkActivity(row)">
              活动
            </el-button>
            <el-button type="success" size="mini" @click="checkStudent(row)">
              学生名单
            </el-button>
        </template>
  </el-table-column>

  <el-table-column
    label="操作"
    align="center"
    width="220"
    class="operation-group"
    class-name="small-padding fixed-width"
  >
        <template slot-scope="{ row, $index }">
            <!-- <el-button type="warning" size="mini" @click="previewCourse(row)">
              预览
           </el-button> -->
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button
              v-if="row.is_visible == 0"
              size="mini"
              type="success"
              @click="handleModifyStatus(row, 1)"
            >
              上架
            </el-button>
            <el-button
              v-if="row.is_visible == 1"
              size="mini"
              @click="handleModifyStatus(row, 0)"
            >
              下架
            </el-button>
            <el-button type="warning" size="mini" @click="showSerialNumber(row)">
              序列号
            </el-button>
            <el-popconfirm
              title="是否要删除该记录？"
              @onConfirm="handleDelete(row, $index)"
              style="margin-left: 10px"
            >
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                slot="reference"
                >删除</el-button
              >
            </el-popconfirm>
        </template>
</el-table-column>
</el-table>
<el-dialog
  :title="textMap[dialogStatus]"
  :visible.sync="dialogFormVisible"
  v-loading="listLoading"
>
<el-form
  ref="dataForm"
  :rules="rules"
  :model="temp"
  label-position="left"
  label-width="70px"
  style="margin-left: 50px;"
>
<el-form-item label="课程标题" label-width="80px" prop="title">
  <el-input v-model="temp.title"/>
</el-form-item>
<el-form-item label="课程封面">
  <el-upload
    action="#"
    :headers="uploadOptions.headers"
    :http-request="uploadHttpRequest"
    list-type="picture-card"
    :auto-upload="true"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleUploadRemove"
    :on-success="handleUploadSuccess"
    :fileList="fileList"
    :limit=1
  >
    <i class="el-icon-plus"></i>
  </el-upload>
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="" />
  </el-dialog>
</el-form-item>
<el-form-item label="课程介绍" label-width="80px" prop="description">
  <el-input
    type="textarea"
    :rows="3"
    placeholder="请输入课程介绍"
    v-model="temp.description"
  >
    /</el-input>
</el-form-item>
<el-form-item label="课程类型" label-width="80px" prop="genre">
    <el-select
      v-model="temp.genre"
      placeholder="请选择课程类型"
      clearable
      class="filter-item"
    >
      <el-option
        v-for="(item, k) in genresList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
</el-form-item>
</el-form-item>
<el-form-item label="课程价格">
  <el-input-number
    v-model="temp.price"
    :precision="2"
    :step="1.0"
    :min="0"
    label="课程价格"
  ></el-input-number>
</el-form-item>
<el-form-item label="状态">
  <el-radio-group v-model="temp.status">
    <el-radio :label="0">下架</el-radio>
    <el-radio :label="1">上架</el-radio>
  </el-radio-group>
</el-form-item>
</el-form>
<div slot="footer" >
  <el-button @click="dialogFormVisible = false"> 取消 </el-button>
  <el-button
    type="primary"
    @click="dialogStatus === 'create' ? createData() : updateData()"
    :loading="dialogBtnLoading"
  >
    {{ dialogBtnLoading ? "提交中..." : "提交" }}
  </el-button>
</div>
</el-dialog>
    <el-dialog :visible.sync="previewDialogVisible" :before-close="handleClose">
      <img width="100%" :src="previewMedia" alt="" v-if="previewFormat == 'Photo'"/>
      <VideoPlayer :src="previewMedia" v-if="previewFormat == 'Video'"></VideoPlayer>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchCourses,
  createCourse,
  deleteCourse,
  updateStatus,
  fetchFormatsList,
  fetchGenresList,
  updateCourse,
  fetchPreviewLecture,
  fetchLectureCount,
} from "@/api/column";
import { fetchStudentCount } from "@/api/user";
import { parseTime, uploadOptions } from "@/utils";
import { mapGetters } from "vuex";
import BaseDialog from "@/components/ui/BaseDialog.vue";
import axios from "axios";
import waves from "@/directive/waves";
import VideoPlayer from "@/components/course/VideoPlayer.vue";

const statusOptions = {
  0: "已下架",
  1: "已上架",
};

const genresOptions = {};
const formatOptions = {};
const studentCountOptions = {};
const lectureCountOptions = {};

export default {
  name: "column",
  inject: ["reload"],
  filters: {
    statusFilter(status) {
      return statusOptions[status ? 1 : 0];
    },
    genreNameFilter(status) {
      return genresOptions[status];
    },
    studentCountFilter(course_id) {
      return studentCountOptions[course_id];
    },
    lectureCountFilter(course_id) {
      return lectureCountOptions[course_id];
    },
  },
  components: {
    BaseDialog,
    VideoPlayer,
  },
  directives: {
    waves,
  },
  data() {
    return {
      serialNumber: null,
      dialogBtnLoading: false,
      listLoading: true,
      tableKey: 0,
      list: null,
      uploadOptions,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        title: undefined,
        sort: "-id",
        genre: null,
      },
      temp: {
        id: undefined,
        title: "",
        is_visible: null,
        description: "",
        cover: "",
        genre: null,
        price: 0,
      },
      dialogStatus: "",
      dialogFormVisible: false,
      textMap: {
        update: "修改",
        create: "新增",
      },
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "内容不能为空",
            trigger: "blur",
          },
        ],
        genre: [
          {
            required: true,
            message: "类型不能为空",
            trigger: "blur",
          },
        ],
      },
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      genresList: [],
      statusList: ["已下架", "已上架"],
      cover_name: "",
      cover_url: "",
      previewDialogVisible: false,
      previewMedia: "",
      previewFormat: "",
    };
  },
  created() {
    this.getGenresList();
    this.getFormatsList();
    this.getList();
  },
  computed: {
    ...mapGetters(["id"]),
  },
  methods: {
    getGenresList() {
      this.listLoading = true;
      fetchGenresList().then((response) => {
        this.genresList = response.data;
        for (var genre in this.genresList) {
          genresOptions[this.genresList[genre].id] =
            this.genresList[genre].name;
        }
        this.listLoading = false;
      });
    },
    getFormatsList() {
      this.listLoading = true;
      fetchFormatsList().then((response) => {
        let formats = response.data;
        for (var format in formats) {
          formatOptions[formats[format].id] = formats[format].name;
        }
        this.listLoading = false;
      });
    },
    uploadHttpRequest(param) {
      this.listLoading = true;
      let formData = new FormData();
      formData.append("file", param.file);
      axios
        .post(this.uploadOptions.action, formData)
        .then((response) => {
          this.temp.cover = response.data["name"];
          this.cover_name = response.data["name"];
          this.cover_url = response.data["image"];
          this.$message({
            message: "操作成功",
            type: "success",
          });
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    showSerialNumber(data) {
      this.serialNumber = data.serial_number.toString();
      this.serialNumberIsShow = true;
    },
    handleSerialNumberVisible() {
      this.serialNumber = null;
    },
    getList() {
      this.listLoading = true;
      this.listQuery.id = this.id;
      fetchCourses(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        for (var i = 0; i < this.list.length; i++) {
          this.setCountOptions(this.list[i].id);
        }
        this.listLoading = false;
      });
    },
    setCountOptions(course_id) {
      fetchStudentCount({
        course_id: course_id,
        mode: "count",
      }).then((response) => {
        studentCountOptions[course_id] = response.data;
      });
      fetchLectureCount({
        course_id: course_id,
        mode: "count",
      }).then((response) => {
        lectureCountOptions[course_id] = response.data;
      });
    },

    handleFilter() {
      // this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: "",
        status: null,
        description: "",
        cover: "",
        genre: null,
        price: 0,
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    previewLecture(media) {
      this.previewDialogVisible = true;
      this.previewMedia = media;
      this.previewFormat = "Photo";
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    handleDelete(row, index) {
      this.listLoading = true;
      deleteCourse({
        id: row.id,
      })
        .then((response) => {
          this.$notify({
            title: "提示",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.list.splice(index, 1);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleModifyStatus(row, status) {
      this.listLoading = true;
      updateStatus({
        id: row.id,
        status,
        update: "status",
      })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          row.is_visible = status;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.temp["status"] = this.temp["is_visible"] ? 0 : 1;
      if (this.temp.cover_img) {
        this.fileList = [
          {
            name: this.temp.cover_img,
            url: this.temp.cover_img,
          },
        ];
      }
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    openDetail(row) {
      this.$router.push({
        name: "Lecture",
        query: {
          id: row.id,
        },
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleUploadSuccess(response, file, fileList) {
      // if (response.msg == "fail") {
      //   this.fileList = [];
      //   return this.$message.error("上传失败");
      // }
      // this.temp.cover = response.data;
      // this.fileList = [
      //   {
      //     name: response.data,
      //     url: response.data,
      //   },
      // ];
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    checkStudent(row) {
      this.$router.push({
        name: "Student",
        query: {
          id: row.id,
        },
      });
    },
    handleUploadRemove(file, fileList) {},
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          this.temp["owner"] = this.id;
          this.temp["genre"] = this.temp.genre;
          this.temp["cover"] = this.temp.cover;
          this.temp["price"] = this.temp.price;
          createCourse(this.temp)
            .then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建课程成功",
                type: "success",
                duration: 2000,
              });
              this.reload();
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData["update"] = "row";
          tempData["cover_name"] = this.cover_name;
          this.dialogBtnLoading = true;
          updateCourse(tempData)
            .then(() => {
              this.temp["get_image"] = this.cover_url;
              const index = this.list.findIndex((v) => v.id === this.temp.id);
              this.list.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新课程成功",
                type: "success",
                duration: 2000,
              });
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
    checkActivity(row) {
      this.$router.push({
        name: "Activity",
        query: {
          id: row.id,
        },
      });
    },
    previewCourse(row) {
      this.listLoading = true;
      this.previewDialogVisible = true;
      fetchPreviewLecture({
        id: row.id,
        mode: "preview",
      })
        .then((res) => {
          (this.previewMedia = res.data["media"]),
            (this.previewFormat = formatOptions[res.data["format"]]),
            this.$message({
              message: "操作成功",
              type: "success",
            });
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleClose() {
      this.previewDialogVisible = false;
      this.previewFormat = "Photo";
    },
  },
};
</script>

<style lang="scss">
.el-button--mini {
  min-width: 32px !important;
  margin-right: -8px;
}
.v-modal {
  z-index: 10 !important;
}
.pre-image {
  width: 100px;
  height: 50px;
  margin-right: 10px;
  &:hover {
    box-shadow: 0 26px 40px -24px rgba(0, 36, 100, 0.3);
    opacity: 0.6;
    cursor: pointer;
  }
}
</style>
