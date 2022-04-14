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
      新增专栏
    </el-button>
    <div>
      <el-select
        v-model="listQuery.status"
        placeholder="商品状态"
        clearable
        style="width: 90px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="(item, k) in statusOptions"
          :key="k"
          :label="item"
          :value="k"
          />
        </el-select>
        <el-input
          v-model="listQuery.title"
          placeholder="标题"
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
    </el-select>
  </div>


  </div>
  </div>
</template>

<script>
import {
  fetchList,
} from "@/api/column";

const statusOptions = {
  0: "已下架",
  1: "已上架",
};

export default {
  data() {
    return {
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status: undefined,
        title: undefined,
        sort: "-id",
      },
      statusOptions,
    };
  },
    methods: {
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then((response) => {
          this.list = response.data.items;
          this.total = response.data.total;
          this.listLoading = false;
      });
      },
      handleFilter() {
          this.listQuery.page = 1;
          this.getList();
        },
      handleCreate() {
        console.log(11);
      },
    },
};

</script>
