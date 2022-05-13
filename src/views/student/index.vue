<template>
  <div class="app-container">
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between"
    >
      <el-button
        v-if="currentSelectedCourse != null"
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加学生
      </el-button>
      <div>
        <el-input
          v-model="listQuery.keyword"
          placeholder="学生名"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
      </div>
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
      ref="multipleTable"
    >
      <el-table-column label="用户" width="150px" min-width="180px">
        <template slot-scope="{ row }">
          <div style="display: flex; align-items: center">
            <img
              :src="
                row.get_image ||
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80'
              "
              style="
                width: 50px;
                height: 50px;
                margin-right: 10px;
                border-radius: 100%;
              "
            />
            <span>{{ row.username }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="checkInfo(row, $index)">
            详情
          </el-button>
          <el-popconfirm
            title="是否要移除该学生？"
            @onConfirm="handleDelete(row, $index)"
            style="margin-left: 10px"
          >
            <el-button
              v-if="currentSelectedCourse != null"
              size="mini"
              type="danger"
              slot="reference"
              >退课</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="新增"
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
        <el-form-item label="学生序号" label-width="80px" prop="title">
          <el-input v-model="temp.user_id" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="createData()"
          :loading="dialogBtnLoading"
        >
          {{ dialogBtnLoading ? "提交中..." : "提交" }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="学生信息" :visible.sync="studentInfoDialogFormVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >
        <el-form-item label="学生ID">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <el-form-item label="学生名">
          <el-input v-model="temp.name" disabled />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="temp.email" disabled />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            type="textarea"
            v-model="temp.short_intro"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="temp.username" disabled />
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            type="date"
            placeholder="Pick a date"
            v-model="temp.created_time"
            style="width: 100%"
            disabled
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="居住地址">
          <el-input v-model="temp.location" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="studentInfoDialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from "@/api/user";
import {
  fetchCourseList,
  createSelection,
  deleteSelection,
} from "@/api/column";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";

let course_id = null;

export default {
  beforeRouteEnter(to, from, next) {
    course_id = to.query.id;
    next();
  },
  data() {
    return {
      courseList: [],
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      currentSelectedCourse: null,
      listQuery: {
        keyword: undefined,
        selectedCourse: course_id,
      },
      dialogFormVisible: false,
      studentInfoDialogFormVisible: false,
      listLoading: true,
      rules: {
        user_id: [
          {
            required: true,
            message: "用户序号不能为空",
            trigger: "blur",
          },
        ],
      },
      temp: {
        user_id: "",
        bio: "",
        created_time: "",
        email: "",
        get_image: "",
        id: "",
        location: "",
        name: "",
        short_intro: "",
        username: "",
      },
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
    this.getCourseList();
    this.getList();
  },
  methods: {
    filterStudent(e) {
      console.log(e.target.value);
    },
    getCourseList() {
      this.currentSelectedCourse = course_id;
      this.listLoading = true;
      fetchCourseList({
        id: this.id,
      }).then((response) => {
        this.courseList = response.data;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.currentSelectedCourse = this.listQuery.selectedCourse;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.data.length;
        this.listLoading = false;
      });
    },
    checkInfo(row, index) {
      this.temp = Object.assign({}, row);
      this.studentInfoDialogFormVisible = true;
    },
    resetTemp() {
      this.temp = {
        user_id: "",
        bio: "",
        created_time: "",
        email: "",
        get_image: "",
        id: "",
        location: "",
        name: "",
        short_intro: "",
        username: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogFormVisible = true;
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.dialogBtnLoading = true;
          const tempData = {
            user: this.temp.user_id,
            course: this.listQuery.selectedCourse,
          };
          createSelection(tempData)
            .then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "课程添加学生成功",
                type: "success",
                duration: 2000,
              });
              this.getList();
            })
            .finally(() => {
              this.dialogBtnLoading = false;
            });
        }
      });
    },
    handleDelete(row, index) {
      this.listLoading = true;
      deleteSelection({
        user: row.id,
        course: this.listQuery.selectedCourse,
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
