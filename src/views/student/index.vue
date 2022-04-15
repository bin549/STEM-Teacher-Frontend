<template>
    <div class="app-container">
        <div
          class="filter-container"
          style="display: flex; justify-content: space-between"
        >
        <div>
            <el-input
              v-model="listQuery.keyword"
              placeholder="用户名"
              style="width: 200px"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
              <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
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
        <el-table-column label="用户"  width="310px" min-width="180px">
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
        <el-table-column label="email" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="location" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.location }}</span>
          </template>
        </el-table-column>
        <el-table-column label="short_intro" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.short_intro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
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


    <info ref="info"></info>
    </div>
</template>

<script>
import { fetchList } from "@/api/user";
import waves from "@/directive/waves";
import info from "./info";

export default {
    data() {
        return {
            tableKey: 0,
            list: [],
            total: 0,
            listLoading: true,
            listQuery: {
              keyword: undefined,
            },
        };
    },
  components: {
    info,
  },
  directives: {
    waves,
  },
      created() {
        this.getList();
      },
    methods: {
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
