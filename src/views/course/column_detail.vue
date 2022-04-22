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
            <small style="color: #bbbbbb">{{
              ""
            }}</small>
          </div>
          <p style="margin: 8px 0">
            <small style="color: #bbbbbb">{{ detail.description }}</small>
          </p>
          <p>
            <small style="color: red"></small>
          </p>
          <el-button-group style="float: right;">
            <el-button size="small" type="warning" @click="changeCourseStatus">
              {{ detail.is_visible ? "下架" : "上架" }}
            </el-button>
            <!-- <el-button size="small" type="default" @click="changeDetailIsend"
              >设为连载中</el-button
            > -->
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
          @click="handleVideoCreate"
        >
          新增视频课程
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click="handlePhotoCreate"
        >
          新增图文课程
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
    >
    <el-table-column type="index" width="50">
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
              disabled
            >
              当前预览
            </el-button>
            <el-button
              v-if="!row.is_preview"
              size="mini"
              @click="handlePreviewStatus(row)"
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

            <el-popconfirm
              title="是否要删除该记录？"
              @onConfirm="handleDelete(row, $index)"
              style="margin-left: 10px"
            >
              <el-button
                size="mini"
                type="danger"
                slot="reference"
                >删除</el-button>
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
                  :limit=1
                >
                  <el-button size="small" type="primary">上传视频</el-button>
                  <div slot="tip" class="el-upload__tip">
                    支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。
                    当前店铺版本最大支持720高清转码
                  </div>
                </el-upload>
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
                    :limit=1
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
            <el-dialog :visible.sync="previewDialogVisible">
              <img width="100%" :src="previewMedia" alt="" v-if="previewFormat == 'Photo'"/>
              <VideoPlayer :src="previewMedia" v-if="previewFormat == 'Video'"></VideoPlayer>
            </el-dialog>
    </div>

</template>

<script>
let id = 0;
const statusOptions = {
  0: "是",
  1: "否",
};
const formatOptions = {
};
const formatRevertOptions = {
};
const formatNameOptions = {
    "Video" : "视频",
    "Photo" : "图文",
};

import {
  fetchCourseDetail,
  fetchCourseLectures,
  fetchFormatsList,
  createLecture,
  deleteLecture,
  setPreviewLecture,
} from "@/api/column.js";
import axios from "axios";
import VideoPlayer from "@/components/course/VideoPlayer.vue";

import Sortable from "sortablejs";
import { parseTime, uploadOptions } from "@/utils";

export default {
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
    }
  },
    data() {
        return {
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
          },
          photoList: [],
          videoList: [],
          dialogVisible: false,
          dialogImageUrl: "",
          dialogBtnLoading: false,
          photoDialogFormVisible: false,
          videoDialogFormVisible: false,
          uploadOptions,
          previewDialogVisible: false,
          previewMedia: "",
          previewFormat: "",
        };
    },
  created() {
    this.getData();
    this.getFormatsList();
    this.getList();
 },
  methods: {
      getData() {
          this.detailLoading = true;
          fetchCourseDetail(({
            id: id,
            method: 1,
          })
        ).then((response) => {
                this.detail = response.data;
            })
            .finally(() => {
              this.detailLoading = false;
            });
      },
      getFormatsList() {
        this.listLoading = true;
        fetchFormatsList().then((response) => {
          let formats = response.data;
          for (var format in formats) {
              formatOptions[formats[format].id] = formats[format].name
              formatRevertOptions[formats[format].name] = formats[format].id
          }
          this.listLoading = false;
          });
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
          const { data } = await fetchCourseLectures(this.listQuery);
          this.list = data;
          this.listLoading = false;
      },
      changeCourseStatus() {},
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
          axios.post(this.uploadOptions.action, formData).then((response) => {
              this.temp["content"]  = response.data.name;
              this.$message({
                message: "操作成功",
                type: "success",
              });
              }).finally(() => {
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
      handleDelete(row, index) {
          this.listLoading = true;
          deleteLecture({
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
      handlePreviewStatus(row) {
          this.listLoading = true;
          setPreviewLecture({
            id: row.id,
            update: "status",
          })
          .then((res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            // row.is_preview = true;
          })
          .finally(() => {
              this.reload();
              this.listLoading = false;
            });
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
