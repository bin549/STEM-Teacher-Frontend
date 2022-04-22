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
  <el-table-column label="创建时间" width="150px" align="center">
    <template slot-scope="{ row }">
        <span>{{
          row.start_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
        }}</span>
    </template>
  </el-table-column>
    <el-table-column label="创建时间" width="150px" align="center">
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
            <el-button type="warning" size="mini" @click="openDetail(row)">
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
    </div>
</template>

<script>
import {
    fetchAssignment,
} from "@/api/activity";
import { fetchCourseList } from "@/api/column";
import waves from "@/directive/waves";
import { parseTime } from "@/utils";
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
            list: null,
            total: 0,
            listLoading: true,
            currentSelectedCourse: null,
            listQuery: {
                page: 1,
                selectedCourse: course_id,
            },
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
        fetchCourseList(this.id).then((response) => {
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
      handleCreate() {
          this.listLoading = true;
      },
      getSortClass() {},
      handleUpdate() {},

    openDetail(row) {
         this.$router.push({
           name: "Execution",
           query: {
             id: row.id,
           },
         });
       },
    },
};


</script>
