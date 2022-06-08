<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="detailLoading">
      <div style="display: flex; align-items: flex-start">
        <img
          :src="detail.cover_img"
          style="width: 200px; height: 100px; margin-right: 20px"
        />
        <div style="flex: 1">
          <div style="display: flex; justify-content: space-between">
            <h4 style="margin-top: 5px; margin-bottom: 0">
              {{ detail.title }}
            </h4>
            <small style="color: #bbbbbb">{{ "" }}</small>
          </div>
          <p style="margin: 8px 0">
            <small style="color: #bbbbbb">{{ detail.description }}</small>
          </p>
          <p>
            <small style="color: red"></small>
          </p>
          <el-button-group style="float: right">
            <el-badge :value="12" class="item">
              <el-button size="small" type="default" @click="checkEvaluation">
                查看课程评论
              </el-button>
            </el-badge>
          </el-button-group>
        </div>
      </div>
    </el-card>
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between; margin-top: 20px"
    >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增课时
      </el-button>
    </div>
    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
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
        <template slot-scope="{ row }">
          <span>{{ row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="240" min-width="180px">
        <template slot-scope="{ row }">
          <div style="display: flex">
            <img
              :src="row.media"
              class="pre-image"
              @click="previewLecture(row.media, row.format)"
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
      <el-table-column label="类型" width="110px" align="center">
        <template slot-scope="{ row }">
          <el-tag type="default">
            <span>{{ row.format | lectureFormatFilter }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.created_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预览设定" class-name="status-col" width="100">
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="row.is_preview"
            size="mini"
            type="success"
            @click="handlePreviewStatus(row, 0)"
          >
            取消预览
          </el-button>
          <el-button
            v-if="!row.is_preview"
            size="mini"
            @click="handlePreviewStatus(row, 1)"
          >
            设为预览
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-badge
            is-dot
            style="margin-right: 10px"
            v-if="!row.is_comment_check"
          >
            <el-button
              size="mini"
              type="default"
              @click="checkComment(row, true)"
              >查看评论</el-button
            >
          </el-badge>
          <el-button
            size="mini"
            type="default"
            @click="checkComment(row, false)"
            v-else
            >查看评论</el-button
          >
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-popconfirm
            title="是否要删除该记录？"
            @onConfirm="handleDelete(row, $index)"
            style="margin-left: 10px"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column align="center" label="播放顺序" width="80">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      v-loading="listLoading"
      style="width: 30rem; margin-left: 40rem; margin-top: 5rem"
    >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handlePhotoCreate"
      >
        <i class="el-icon-picture-outline" style="font-size: 2.5rem"></i>
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        @click="handleVideoCreate"
      >
        <i class="el-icon-video-camera" style="font-size: 2.5rem"></i>
      </el-button>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="videoDialogFormVisible"
      v-loading="listLoading"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-upload
            class="upload-demo"
            action="#"
            :headers="uploadOptions.headers"
            :http-request="uploadHttpRequest"
            :on-remove="handleRemove"
            :file-list="videoList"
            accept=".mp4,.avi,.wmv,.mov,.flv,.rmvb"
            :on-success="handleVideoUploadSuccess"
            multiple
            :limit="50"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <div slot="tip" class="el-upload__tip">
              支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。
              当前店铺版本最大支持720高清转码
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="免费试看">
          <el-radio-group v-model="temp.is_free">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="videoDialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          :loading="dialogBtnLoading"
        >
          {{ dialogBtnLoading ? "提交中..." : "提交" }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="photoDialogFormVisible"
      v-loading="listLoading"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-upload
            action="#"
            :headers="uploadOptions.headers"
            :http-request="uploadHttpRequest"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleUploadRemove"
            :on-success="handleUploadSuccess"
            :fileList="photoList"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="photoDialogFormVisible = false"> 取消 </el-button>
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
      <img
        width="100%"
        :src="previewMedia"
        alt=""
        v-if="previewFormat == 'Photo'"
      />
      <VideoPlayer
        :src="previewMedia"
        v-if="previewFormat == 'Video'"
      ></VideoPlayer>
    </el-dialog>
    <el-dialog
      title="用户详情"
      :visible.sync="evaluationDialogVisible"
      width="80%"
      top="5vh"
    >
      <el-container>
        <el-header style="height: 5vh">
          <el-row :gutter="20">
            <el-col :span="6"
              ><p>ID： {{ id }}</p></el-col
            >
          </el-row>
        </el-header>
        <el-container>
          <el-container>
            <el-main style="height: 45vh; padding: 0; overflow-y: auto">
              <el-table
                :key="evaluationTableKey"
                :data="evaluations"
                border
                fit
                highlight-current-row
                style="width: 100%"
                ref="multipleTable"
                @selection-change="handleEvaluationSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="学生" width="55">
                  <template slot-scope="{ row }">
                    <span> {{ row.user | studentNameFilter }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="评论内容">
                  <template slot-scope="{ row }">
                    <span v-html="row.content"></span>
                  </template>
                </el-table-column>
                <el-table-column label="评论时间" width="155">
                  <template slot-scope="{ row }">
                    <span> {{ row.evaluate_time | parseTime }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="{ row, $index }">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleEvaluationDelete(row, $index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-container>
        <el-footer>
          <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-footer>
      </el-container>
    </el-dialog>
    <el-dialog
      title="用户详情"
      :visible.sync="commentDialogVisible"
      width="80%"
      top="5vh"
    >
      <el-container>
        <el-header style="height: 5vh">
          <el-row :gutter="20">
            <el-col :span="6"
              ><p>ID： {{ id }}</p></el-col
            >
          </el-row>
        </el-header>
        <el-container>
          <el-container>
            <el-main style="height: 45vh; padding: 0; overflow-y: auto">
              <el-table
                :key="commentTableKey"
                v-loading="commentsLoading"
                :data="comments"
                border
                fit
                highlight-current-row
                style="width: 100%"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="学生" width="70">
                  <template slot-scope="{ row }">
                    <span> {{ row.user | studentNameFilter }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="评论内容">
                  <template slot-scope="{ row }">
                    <span v-html="row.content"></span>
                  </template>
                </el-table-column>
                <el-table-column label="评论时间" width="170">
                  <template slot-scope="{ row }">
                    <span> {{ row.comment_time | parseTime }} </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  align="center"
                  width="230"
                  class-name="small-padding fixed-width"
                >
                  <template slot-scope="{ row, $index }">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleCommentDelete(row, $index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-container>
        <el-footer>
          <span slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-footer>
      </el-container>
    </el-dialog>
    <!--
                    <el-main style="height: 55vh; padding-bottom: 0">
                      <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane
                          :label="item.label"
                          :name="item.name"
                          v-for="(item, index) in tabs"
                          :key="index"
                        >
                          <el-table
                            :data="list"
                            height="280"
                            border
                            style="width: 100%"
                            v-loading="listLoading"
                          >
                            <el-table-column
                              :prop="t.prop"
                              :label="t.label"
                              v-for="(t, tI) in item.ths"
                              :key="tI"
                            >
                            </el-table-column>
                          </el-table>
                        </el-tab-pane>
                      </el-tabs>
                    </el-main>
                    <el-footer>
                      <pagination
                        :total="form.total"
                        :page.sync="form.page"
                        :limit.sync="form.limit"
                        @pagination="getData"
                        style="padding: 0; padding-top: 10px; margin: 0"
                        layout="total,prev,pager,next"
                      />
                    </el-footer>
                -->
  </div>
</template>

<script>
let id = 0;
const statusOptions = {
  0: "是",
  1: "否",
};
const formatOptions = {};
const formatRevertOptions = {};
const formatNameOptions = {
  Video: "视频",
  Photo: "图文",
};
const studentNameOptions = {};

import {
  fetchCourse,
  fetchLectures,
  fetchFormats,
  createLecture,
  deleteLecture,
  setPreviewLecture,
  fetchComments,
  deleteComments,
  fetchEvaluations,
  updateComment,
} from "@/api/column.js";

import { fetchStudents } from "@/api/user.js";
import axios from "axios";
import VideoPlayer from "@/components/course/VideoPlayer.vue";
import Sortable from "sortablejs";
import { parseTime, uploadOptions } from "@/utils";

export default {
  name: "lecture",
  inject: ["reload"],
  beforeRouteEnter(to, from, next) {
    id = to.query.id;
    next();
  },
  components: {
    VideoPlayer,
  },
  filters: {
    statusFilter(status) {
      return statusOptions[status ? 0 : 1];
    },
    lectureFormatFilter(format_id) {
      return formatNameOptions[formatOptions[format_id]];
    },
    studentNameFilter(student_id) {
      return studentNameOptions[student_id];
    },
  },
  data() {
    return {
      id: 0,
      list: [],
      listLoading: true,
      detailLoading: false,
      detail: {
        id: 0,
        created_time: "",
        title: "",
        description: "",
        cover_img: "",
        genre: 0,
        is_visible: 1,
        serial_number: "",
      },
      listQuery: {
        course_id: id,
        page: 1,
        sort: "index",
      },
      statusOptions,
      dialogStatus: "",
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
      },
      temp: {
        course: null,
        title: "",
        content: null,
        format: null,
        is_free: false,
        is_comment_check: false,
      },
      photoList: [],
      videoList: [],
      dialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: "",
      dialogBtnLoading: false,
      photoDialogFormVisible: false,
      videoDialogFormVisible: false,
      uploadOptions,
      previewDialogVisible: false,
      previewMedia: "",
      previewFormat: "",
      commentDialogVisible: false,
      commentTableKey: 0,
      commentsLoading: false,
      comments: [],
      evaluationDialogVisible: false,
      evaluationTableKey: 0,
      evaluationsLoading: false,
      evaluations: [],
      multipleEvaluationSelection: [],
      multipleSelection: [],
      form: {
        title: "",
        page: 1,
        limit: 10,
      },
      selectedLectureId: null,
    };
  },
  created() {
    this.getData();
    this.getStudentList();
    this.getFormatsList();
    this.getList();
  },
  methods: {
    getData() {
      this.detailLoading = true;
      fetchCourse({
        id: id,
        method: 1,
      })
        .then((response) => {
          this.detail = response.data;
        })
        .finally(() => {
          this.detailLoading = false;
        });
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost",
        setData: function (dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: (evt) => {
          const targetRow = this.list.splice(evt.oldIndex, 1)[0];
          this.list.splice(evt.newIndex, 0, targetRow);
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          this.newList.splice(evt.newIndex, 0, tempIndex);
          this.listLoading = true;
          sortColumnCourse({
            ids: this.newList,
            column_id: id,
          })
            .then((res) => {
              this.$message({
                message: "排序成功",
                type: "success",
              });
            })
            .finally(() => {
              this.listLoading = false;
              this.getList();
            });
        },
      });
    },
    getFormatsList() {
      this.listLoading = true;
      fetchFormats().then((response) => {
        let formats = response.data;
        for (var format in formats) {
          formatOptions[formats[format].id] = formats[format].name;
          formatRevertOptions[formats[format].name] = formats[format].id;
        }
        this.listLoading = false;
      });
    },
    getStudentList() {
      this.listLoading = true;
      fetchStudents().then((response) => {
        let students = response.data;
        for (var student in students) {
          studentNameOptions[students[student].id] = students[student].name;
        }
        this.listLoading = false;
      });
    },
    handleCreate() {
      this.dialogFormVisible = true;
    },
    handleVideoCreate() {
      this.dialogStatus = "create";
      this.videoDialogFormVisible = true;
      this.temp["format"] = formatRevertOptions["Video"];
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handlePhotoCreate() {
      this.dialogStatus = "create";
      this.photoDialogFormVisible = true;
      this.temp["format"] = formatRevertOptions["Photo"];
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        course: null,
        title: "",
        content: null,
        format: null,
      };
    },
    async getList() {
      this.resetTemp();
      this.listLoading = true;
      const { data } = await fetchLectures(this.listQuery);
      this.list = data;
      this.listLoading = false;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleUploadRemove() {},
    handleUploadSuccess() {},
    handleRemove() {},
    handleVideoUploadSuccess() {},

    uploadHttpRequest(param) {
      this.listLoading = true;
      let formData = new FormData();
      formData.append("file", param.file);
      axios
        .post(this.uploadOptions.action, formData)
        .then((response) => {
          console.log(response.data);
          this.temp["title"] = response.data.name.split(".").at(-2);
          this.temp["content"] = response.data.name;
          this.$message({
            message: "操作成功",
            type: "success",
          });
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    previewLecture(media, format) {
      this.previewDialogVisible = true;
      this.previewMedia = media;
      this.previewFormat = formatOptions[format];
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          this.temp["course"] = id;
          createLecture(this.temp)
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
    checkComment(row, is_checking) {
      if (is_checking) {
        this.updateComment(row);
      }
      this.selectedLectureId = row.id;
      this.commentDialogVisible = true;
      this.fetchComments();
    },
    updateComment(row) {
      updateComment({
        id: row.id,
      }).then((response) => {
        row.is_comment_check = true;
      });
    },
    fetchComments() {
      this.commentsLoading = true;
      fetchComments({
        id: this.selectedLectureId,
      })
        .then((response) => {
          this.comments = response.data;
        })
        .finally(() => {
          this.commentsLoading = false;
        });
    },
    fetchEvaluations() {
      this.evaluationsLoading = true;
      fetchEvaluations({
        course_id: id,
      })
        .then((response) => {
          this.evaluations = response.data;
        })
        .finally(() => {
          this.evaluationsLoading = false;
        });
    },
    checkEvaluation() {
      this.evaluationDialogVisible = true;
      this.fetchEvaluations();
    },
    handleCommentDelete(row, index) {
      deleteComments({
        id: row.id,
      }).then((response) => {
        this.fetchComments();
      });
    },
    handleEvaluationDelete(row, index) {},
    handleUpdate(row) {},
    handleDelete(row, index) {
      this.listLoading = true;
      deleteLecture({
        id: row.id,
      })
        .then((response) => {
          if (response.data == 1) {
            this.$notify({
              title: "提示",
              message: "删除成功",
              type: "success",
              duration: 2000,
            });
            this.list.splice(index, 1);
          } else {
            this.$notify({
              title: "提示",
              message: "删除失败",
              type: "error",
              duration: 2000,
            });
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handlePreviewStatus(row, status) {
      this.listLoading = true;
      setPreviewLecture({
        id: row.id,
        is_preview: status,
      })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          row.is_preview = status;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEvaluationSelectionChange(val) {
      this.multipleEvaluationSelection = val;
    },
    close() {},
    confirm() {},
    handleClose() {
      this.previewDialogVisible = false;
      this.previewFormat = "Photo";
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "index";
      } else {
        this.listQuery.sort = "-index";
      }
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style scoped lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
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
