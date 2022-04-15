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
      新增图文
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
      @sort-change="sortChange"
    >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="80"
          :class-name="getSortClass('id')"
        >
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="图文内容" width="350px" min-width="180px">
          <template slot-scope="{ row }">
            <div style="display: flex">
              <img
                :src="row.media"
                style="width: 100px; height: 50px; margin-right: 10px"
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
        <el-table-column label="创建时间" width="180px" align="center">
          <template slot-scope="{ row }">
              <span>{{
                row.created_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
              }}</span>
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
    </el-table>
</div>
</template>

<script>
import {
  fetchCourseLectures,
} from "@/api/column.js";

import { parseTime } from "@/utils";

export default {

    data() {
        return {
            tableKey: 0,
            list: null,
            listLoading: true,
            listQuery: {
                type: "Photo",
            },

        };
    },
  created() {
    this.getList();
  },
  methods: {
      getList() {
          this.listLoading = true;
          fetchCourseLectures(this.listQuery).then((response) => {
              this.list = response.data;
              this.total = response.data.length;
              this.listLoading = false;
          });
      },
      sortChange() {},
      handleCreate() {},
      getSortClass() {},
      handleDelete() {},
  },

};
</script>
