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
          创建
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

</el-table>
    </div>
</template>


<script>
import { parseTime } from "@/utils";

export default {
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

        },
        handleCreate() {},

    },


};


</script>
