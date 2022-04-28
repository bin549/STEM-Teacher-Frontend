<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between"
    >
      <div>
        <el-select
          v-model="listQuery.selectedCourse"
          placeholder="是否评改"
          clearable
          style="width: 8rem; margin-right: 1rem"
          class="filter-item"
        >
          <el-option
            v-for="(item, k) in postStatus"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </div>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="float: right; margin-right: 3rem"
        @click="handleFilter"
      >
        搜索
      </el-button>

      <el-button
        v-waves
        class="filter-item"
        type="info"
        icon="el-icon-search"
        style="float: right; margin-right: 3rem"
        @click="backPage"
      >
        返回
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
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
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生" width="60px" min-width="180px">
        <template slot-scope="{ row }">
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <span>{{ row.user | userNameFilter }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="160px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.finish_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优秀" width="60px" min-width="180px">
        <template slot-scope="{ row }">
          <el-tag :type="row.is_excellent ? 'success' : 'info'">
            {{ row.is_excellent | statusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="评价" width="150px" min-width="180px">
        <template slot-scope="{ row }">
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
            <el-rate v-model="row.appraise_star" disabled></el-rate>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评语" width="260px" min-width="180px">
        <template slot-scope="{ row }">
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            "
          >
              <span>{{ row.appraise_text }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            v-if="row.finish_time == null"
            disabled
          >
            检查
          </el-button>
          <el-button
            type="warning"
            size="mini"
            v-if="row.finish_time != null"
            @click="checkExecution(row)"
          >
            检查
          </el-button>
          <el-button
            v-if="row.is_excellent == 0 && row.finish_time == null"
            size="mini"
            type="success"
            @click="handleExcellentStatus(row, 1)"
            disabled
          >
            评优
          </el-button>
          <el-button
            v-if="row.is_excellent == 0 && row.finish_time != null"
            size="mini"
            type="success"
            @click="handleExcellentStatus(row, 1)"
          >
            评优
          </el-button>
          <el-button
            v-if="row.is_excellent == 1"
            size="mini"
            @click="handleExcellentStatus(row, 0)"
            disabled
          >
            已评优
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="Check"
      :visible.sync="dialogFormVisible"
      v-loading="listLoading"
    >
      {{ execution_text }}
      <el-row>
        <el-col
          :span="8"
          v-for="({ img_url, img_preview_url }, index) of execution_image"
          :key="index"
          style="padding: 0"
        >
          <el-card shadow="hover">
            <div
              style="
                display: flex;
                align-items: center;
                flex-direction: column;
                cursor: pointer;
              "
            >
              <el-image
                style="width: 130px; height: 130px"
                :src="img_url"
                :preview-src-list="img_preview_url"
              >
              </el-image>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >

      <el-form-item label="Star" label-width="80px" prop="appraise_star">
          <el-rate v-model="temp.appraise_star"></el-rate>
      </el-form-item>

        <el-form-item label="Text" label-width="80px" prop="appraise_text">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Please input"
              v-model="temp.appraise_text">
            </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="updateAppraise()"
          :loading="dialogBtnLoading"
        >
          {{ dialogBtnLoading ? "提交中..." : "提交" }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchExecution,
  updateExecution,
  fetchExecutionImage,
} from "@/api/activity";
import { fetchCourseId } from "@/api/column";
import { fetchList } from "@/api/user";
import waves from "@/directive/waves";

const statusOptions = {
  0: "是",
  1: "否",
};

const userNameOptions = {};

import { parseTime } from "@/utils";

let assignment_id = null;

export default {
  directives: {
    waves,
  },
  beforeRouteEnter(to, from, next) {
    assignment_id = to.query.id;
    next();
  },
  inject: ["reload"],
  data() {
    return {
      execution_text: "Hello World",
      execution_image: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: assignment_id,
        page: 1,
      },
      temp: {
          appraise_star: 0,
          appraise_text: "",
      },
      rules: {
          appraise_text: [
            {
              required: true,
              message: "不能为空",
              trigger: "blur",
            },
          ],
      },
      postStatus: ["Yes", "No"],
      studentsList: [],
      dialogFormVisible: false,
      listLoading: false,
      dialogBtnLoading: false,
      dialogStatus: false,
    };
  },
  created() {
    this.getStudentsList();
    this.getList();
  },
  filters: {
    statusFilter(status) {
      return statusOptions[status ? 0 : 1];
    },
    userNameFilter(user_id) {
      return userNameOptions[user_id];
    },
  },
  methods: {
    getStudentsList() {
      this.listLoading = true;
      fetchList().then((response) => {
        this.studentsList = response.data;
        for (var student in this.studentsList) {
          userNameOptions[this.studentsList[student].id] =
            this.studentsList[student].name;
        }
        this.listLoading = false;
      });
    },
    getList() {
      this.listLoading = true;
      fetchExecution(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        this.listLoading = false;
      });
    },

    getSortClass() {},

    checkExecution(row) {
      this.dialogFormVisible = true;
      this.temp = Object.assign({}, row);
      this.temp["mode"] = "check";
      fetchExecution(this.temp).then((res) => {
        (this.execution_text = res.data["content_text"]),
          fetchExecutionImage({ id: this.temp["id"] }).then((response) => {
            let images = response.data;
            this.execution_image = [];
            for (var i = 0; i < images.length; i++) {
              this.execution_image.push(
                { img_url: images[i]["media"] },
                { img_preview_url: [images[i]["media"]] }
              );
            }
          });
        // this.previewMedia = res.data["media"],
        // this.previewFormat = formatOptions[res.data["format"]],
        this.$message({
          message: "操作成功",
          type: "success",
        });
      });
    },

    //
    //    .finally(() => {
    //        this.listLoading = false;
    //      });
    // },

    updateAppraise() {
      this.listLoading = true;
      updateExecution(this.temp)
        .then((response) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        })
        .finally(() => {
          this.reload();
          this.listLoading = false;
        });
    },

    handleFilter() {},

    handleExcellentStatus(row, status) {
      this.listLoading = true;
      updateExecution({
        id: row.id,
        mode: "status",
      })
        .then((res) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          row.is_excellent = status;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    backPage() {
      fetchCourseId({ id: assignment_id, mode: "no" }).then((response) => {
        this.$router.push({
          name: "education",
          query: {
            id: response.data.id,
          },
        });
      });
    },
  },
};
</script>
