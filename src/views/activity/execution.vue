<template>
<div class="app-container">
    <div
      class="filter-container"
      style="display: flex; justify-content: space-between"
    >
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

<el-table-column label="user" min-width="180px">
  <template slot-scope="{ row }">
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    "
  >
    <span>{{ row.user }}</span>
  </div>
  </template>
</el-table-column>

<el-table-column label="内容" min-width="180px">
  <template slot-scope="{ row }">
    <div style="display: flex">
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <span>{{ row.content_text }}</span>
      </div>
    </div>
  </template>
</el-table-column>
<el-table-column label="时间" width="150px" align="center">
  <template slot-scope="{ row }">
      <span>{{
        row.finish_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
      }}</span>
  </template>
</el-table-column>

<el-table-column label="is_excellent" width="80px" min-width="180px">
  <template slot-scope="{ row }">

      <el-tag :type="row.is_excellent ? 'success' : 'danger'">
        {{ row.is_excellent | statusFilter }}
      </el-tag>

  </template>
</el-table-column>

<el-table-column label="score" width="80px" min-width="180px">
  <template slot-scope="{ row }">
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    "
  >
    <span>{{ row.score }}</span>
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
            <el-button type="warning" size="mini" @click="checkExecution(row)">
              Check
            </el-button>
        </template>
    </el-table-column>
</el-table>
</div>
</template>



<script>
import {
    fetchExecution,
} from "@/api/activity";

const statusOptions = {
    0: "Bad",
  1: "Nothing",
};


import { parseTime } from "@/utils";

export default {
    filters: {
      statusFilter(status) {
        return statusOptions[status ? 1 : 0];
      },
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
        };
    },
      created() {
        this.getList();
      },
      methods: {
        getList() {
            this.listLoading = true;
            fetchExecution(this.listQuery).then((response) => {
                this.list = response.data;
                this.total = response.data.length;
                console.log(this.list);
                this.listLoading = false;
            });

        },

getSortClass() {},

checkExecution() {},


      },

};


</script>
