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
      style="width:8rem; margin-right: 1rem;"
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
  style="float: right; margin-right: 3rem;"
  @click="handleFilter"
>
  搜索
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
    <span>{{ $index +1 }}</span>
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
<el-table-column label="分数" width="60px" min-width="180px">
  <template slot-scope="{ row }">
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    "
  >
      <el-tag :type="row.score == null ? 'info' : 'default'">
          <span>{{ row.score }}</span>
      </el-tag>
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
            <el-button type="warning" size="mini" v-if="row.finish_time==null" @click="checkExecution(row)" disabled>
              检查
            </el-button>
            <el-button type="warning" size="mini" v-if="row.finish_time!=null" @click="checkExecution(row)">
              检查
            </el-button>
            <el-button
              v-if="row.is_excellent == 0 && row.finish_time==null"
              size="mini"
              type="success"
              @click="handleExcellentStatus(row, 1)"
              disabled
            >
              评优
            </el-button>
            <el-button
              v-if="row.is_excellent == 0 && row.finish_time!=null"
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
</div>
</template>

<script>
import {
    fetchExecution,
    updateStatus,
} from "@/api/activity";

import {
    fetchList,
} from "@/api/user";

import waves from "@/directive/waves";

const statusOptions = {
    0: "是",
    1: "否",
};

const userNameOptions = {
};

import { parseTime } from "@/utils";

export default {
  directives: {
    waves,
  },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
            },
            postStatus : ["Yes", "No"],
            studentsList: [],
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
                  userNameOptions[this.studentsList[student].id] = this.studentsList[student].name
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
    console.log(row);
},

handleFilter() {},

handleExcellentStatus(row, status) {
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
      row.is_excellent = status;
    })
    .finally(() => {
        this.listLoading = false;
      });
},
      },

};


</script>
