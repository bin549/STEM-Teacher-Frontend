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
      style="width:32rem; margin-right: 1rem;"
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
      style="float: right; margin-right: 3rem;"
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
    <span>{{ $index +1 }}</span>
  </template>
</el-table-column>
<el-table-column label="专栏内容" min-width="180px">
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
<el-table-column label="内容" min-width="180px">
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
  <el-table-column label="开始时间" width="150px" align="center">
    <template slot-scope="{ row }">
        <span>{{
          row.start_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
        }}</span>
    </template>
  </el-table-column>
    <el-table-column label="结束时间" width="150px" align="center">
      <template slot-scope="{ row }">
          <span>{{
            row.start_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
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
              检查
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-popconfirm
              title="是否要删除该记录？"
              @onConfirm="handleDelete(row, $index)"
              style="margin-left: 10px"
            >
              <el-button
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
<el-form-item label="活动标题" label-width="80px" prop="title">
  <el-input v-model="temp.title"/>
</el-form-item>
<el-form-item label="活动介绍" label-width="80px" prop="description">
  <tinymce v-model="temp.content" :height="300" :width="600" />
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

    </div>
</template>

<script>
import {
    fetchAssignment,
    createAssignment,
} from "@/api/activity";
import { fetchCourseList } from "@/api/column";
import waves from "@/directive/waves";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import Tinymce from "@/components/Tinymce";

let course_id = null;

export default {
    beforeRouteEnter(to, from, next) {
      course_id = to.query.id;
      next();
    },
  components: {
    Tinymce,
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
                    title: [
                      {
                        required: true,
                        message: "标题不能为空",
                        trigger: "blur",
                      },
                    ],
                      content: [
                        {
                          required: true,
                          message: "内容不能为空",
                          trigger: "blur",
                      },
                    ],
                  },
                  temp: {
              title: "",
              content: "",
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
          this.getCourseList();
        this.getList();
      },
    methods: {
        getCourseList() {
        this.currentSelectedCourse = course_id;
        this.listLoading = true;
        fetchCourseList(({
          id: this.id,
        })
    ).then((response) => {
            this.courseList = response.data;
            this.listLoading = false;
        });
    },
      getList() {
            this.listLoading = true;
            fetchAssignment(this.listQuery).then((response) => {
            this.list = response.data;
            this.total = response.data.length;
            this.listLoading = false;
        });
      },
      handleFilter() {
          this.currentSelectedCourse = this.listQuery.selectedCourse;
          this.getList();
      },
      resetTemp() {
        this.temp = {
            title: "",
            content: "",
        };
      },
      handleCreate() {
          this.resetTemp();
          this.dialogStatus = "create";
          this.dialogFormVisible = true;

      },
      getSortClass() {},
      handleUpdate() {},

    createData() {
          this.$refs["dataForm"].validate((valid) => {
            if (valid) {
              this.dialogBtnLoading = true;
              this.temp["course"] = this.currentSelectedCourse;
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
                  this.reload();
                  this.reload();
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
                this.$router.push({
                  name: "Education",
                  query: {
                    id: currentSelectedCourse,
                  },
                });
              },

    },
};


</script>
