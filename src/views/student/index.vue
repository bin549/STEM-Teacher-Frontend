<template>
    <div class="app-container">
        <div
          class="filter-container"
          style="display: flex; justify-content: space-between;"
        >
        <div>
            <el-input
              v-model="listQuery.keyword"
              placeholder="用户名"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
        </div>
        <div>
        <el-select
          v-model="listQuery.selectedCourse"
          placeholder="所选课程"
          clearable
          style="float:right; width: 420px; margin-right: 30rem;"
          class="filter-item"
        >
          <el-option
            v-for="(item, k) in courseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          style="float: right; margin-right: 30rem;"
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
        <el-table-column label="用户"  width="150px" min-width="180px">
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
        <el-table-column label="email" width="160px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="location" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="short_intro" width="250px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.short_intro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="210px" align="center">
          <template slot-scope="{ row }">
            <span>{{
              row.created_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="280"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="openInfo(row.id)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import { fetchList } from "@/api/user";
import { fetchCourseList } from "@/api/column";
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
            listQuery: {
              keyword: undefined,
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
        filterStudent(e) {
            console.log(e.target.value);
        },
        getCourseList() {
            this.listLoading = true;
            fetchCourseList(this.id).then((response) => {
                this.courseList = response.data;
                this.listLoading = false;
            });
        },
        handleFilter() {
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
        openInfo(id) {
            console.log(id);
        },
    },

};

</script>
