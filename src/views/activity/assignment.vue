<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between"
    >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        v-if="currentSelectedCourse != null"
      >
        新建活动
      </el-button>
      <div>
        <el-select
          v-model="listQuery.selectedCourse"
          placeholder="所选课程"
          clearable
          style="width: 32rem; margin-right: 1rem"
          class="filter-item"
        >
          <el-option
            v-for="(item, k) in courseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
      </div>
      <div>
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
      <el-table-column label="课程标题" width="420px" min-width="120px">
        <template slot-scope="{ row }">
          <div style="display: flex">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              "
            >
              <span>{{ row.intro }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="160px" align="center">
        <template slot-scope="{ row }">
          <span>{{
            row.start_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="160px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.end_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已提交" width="70px" align="center">
        <template slot-scope="{ row }">
          <el-tag type="success">
            {{ row.id | doneExecutionCountFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="未提交" width="70px" align="center">
        <template slot-scope="{ row }">
          <el-tag type="danger">
            {{ row.id | unDoneExecutionCountFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="warning" size="mini" @click="checkAssignment(row)">
            批改
          </el-button>
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
        style="margin-left: 50px"
      >
        <el-form-item label="活动标题" label-width="80px" prop="intro">
          <el-input v-model="temp.intro" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="Pick a date"
              v-model="temp.start_time"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="Pick a time"
              v-model="temp.start_time"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="Pick a date"
              v-model="temp.end_time"
              style="width: 100%"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="Pick a time"
              v-model="temp.end_time"
              style="width: 100%"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="活动介绍" label-width="80px" prop="description">
          <tinymce
            v-model="temp.description"
            :height="300"
            :width="600"
            v-if="dialogFormVisible"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
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
  </div>
</template>

<script>
import {
  createAssignment,
  deleteAssignmnet,
  fetchAssignment,
  updateAssignment,
  fetchExecutionCount,
} from "@/api/activity";
import { fetchCourses } from "@/api/column";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import Tinymce from "@/components/Tinymce";
import waves from "@/directive/waves";

const doneExecutionCountOptions = {};
const unDoneExecutionCountOptions = {};

let course_id = null;

export default {
  beforeRouteEnter(to, from, next) {
    course_id = to.query.id;
    next();
  },
  components: {
    Tinymce,
  },
  filters: {
    doneExecutionCountFilter(activity_id) {
      return doneExecutionCountOptions[activity_id];
    },
    unDoneExecutionCountFilter(activity_id) {
      return unDoneExecutionCountOptions[activity_id];
    },
  },
  data() {
    return {
      courseList: [],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      currentSelectedCourse: null,
      listQuery: {
        page: 1,
        selectedCourse: course_id,
      },
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增",
      },
      rules: {
        intro: [
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
      },
      temp: {
        intro: "",
        description: "",
        start_time: "",
        end_time: "",
      },
      dialogFormVisible: false,
      dialogBtnLoading: false,
    };
  },
  computed: {
    ...mapGetters(["id"]),
  },
  directives: {
    waves,
  },
  created() {
    this.fetchCourses();
    this.fetchAssignments();
  },
  methods: {
    fetchExecutionCount() {
      for (var i = 0; i < this.list.length; i++) {
        let activity_id = this.list[i].id;
        fetchExecutionCount({
          id: this.list[i].id,
          is_done: true,
        }).then((response) => {
          doneExecutionCountOptions[activity_id] = response.data;
        });
      }
      for (var i = 0; i < this.list.length; i++) {
        let activity_id = this.list[i].id;
        fetchExecutionCount({
          id: this.list[i].id,
          is_done: false,
        }).then((response) => {
          unDoneExecutionCountOptions[activity_id] = response.data;
        });
      }
    },
    fetchCourses() {
      this.currentSelectedCourse = course_id;
      this.listLoading = true;
      fetchCourses({
        id: this.id,
      }).then((response) => {
        this.courseList = response.data;
        this.listLoading = false;
      });
    },
    fetchAssignments() {
      this.listLoading = true;
      fetchAssignment(this.listQuery).then((response) => {
        this.list = response.data;
        this.fetchExecutionCount();
        this.total = response.data.length;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.currentSelectedCourse = this.listQuery.selectedCourse;
      this.fetchAssignments();
    },
    resetTemp() {
      this.temp = {
        intro: "",
        description: "",
        start_time: "",
        end_time: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    getSortClass() {},

    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          if (this.currentSelectedCourse != null) {
            console.log(this.currentSelectedCourse);
            this.temp["course"] = this.currentSelectedCourse;
          } else {
            this.temp["course"] = course_id;
          }
          createAssignment(this.temp)
            .then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "创建活动成功",
                type: "success",
                duration: 2000,
              });
            })
            .finally(() => {
              this.dialogBtnLoading = false;
              this.reload();
            });
        }
      });
    },
    checkAssignment(row) {
      this.$router.push({
        name: "Execution",
        query: {
          id: row.id,
        },
      });
    },

    reload(row) {
      if (this.currentSelectedCourse != null) {
        this.$router.push({
          name: "Activity",
          query: {
            id: this.currentSelectedCourse,
          },
        });
      } else {
        this.$router.push({
          name: "Education",
          query: {
            id: course_id,
          },
        });
      }
    },

    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          const tempData = Object.assign({}, this.temp);
          updateAssignment(tempData)
            .then(() => {
              const index = this.list.findIndex((v) => v.id === this.temp.id);
              this.list.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "更新活动信息成功",
                type: "success",
                duration: 2000,
              });
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
          console.log(this.temp);
        }
      });
    },

    handleDelete(row, index) {
      this.listLoading = true;
      deleteAssignmnet({
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
  },
};
</script>
