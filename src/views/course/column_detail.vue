<template>
    <div class="app-container">
        <el-card shadow="never" v-loading="detailLoading">
            <div style="display: flex; align-items: flex-start">
                <img
                  :src="detail.cover_img"
                  style="width: 200px; height: 100px; margin-right: 20px"
                />
            <div style="flex: 1">
              <div style="display: flex; justify-content: space-between">
                <h4 style="margin-top: 5px; margin-bottom: 0">
                  {{ detail.title }}
                </h4>
                <small style="color: #bbbbbb">{{
                  ""
                }}</small>
              </div>
              <p style="margin: 8px 0">
                <small style="color: #bbbbbb">{{ detail.description }}</small>
              </p>
              <p>
                <small style="color: red"></small>
              </p>
              <el-button-group style="float: right;">
                <el-button size="small" type="warning" @click="changeCourseStatus">
                  {{ detail.is_visible ? "下架" : "上架" }}
                </el-button>
                <!-- <el-button size="small" type="default" @click="changeDetailIsend"
                  >设为连载中</el-button
                > -->
              </el-button-group>
            </div>
            </div>
    </el-card>

    <div
      class="filter-container"
      style="display: flex; justify-content: space-between; margin-top: 20px"
    >
    <el-button
      class="filter-item"
      style="margin-left: 10px"
      type="primary"
      icon="el-icon-edit"
      @click="addLecture"
    >
      新增目录
    </el-button>
    <el-table
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

    <el-table-column type="index" width="50">
    </el-table-column>
    <el-table-column label="单品内容" min-width="180px">
        <template slot-scope="{ row }">
            <div style="display: flex">
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
        <el-table-column label="类型" width="110px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.format }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="150px" align="center">
          <template slot-scope="{ row }">
              <span>{{
                row.created_time | parseTime("{y}-{m}-{d} {h}:{i}:{s}")
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.is_preview ? 'success' : 'danger'">
              {{ row.is_preview | statusFilter }}
            </el-tag>
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
        <el-table-column align="center" label="Drag" width="80">
          <template slot-scope="{}">
            <svg-icon class="drag-handler" icon-class="drag" />
          </template>
        </el-table-column>

</el-table>

</div>
    </div>
</template>

<script>
let id = 0;
const statusOptions = {
  0: "已下架",
  1: "已上架",
};

import {
  fetchCourseDetail,
  fetchCourseLectures,
} from "@/api/column.js";
import Sortable from "sortablejs";
import { parseTime } from "@/utils";

export default {
    beforeRouteEnter(to, from, next) {
          id = to.query.id;
          next();
        },
  filters: {
    statusFilter(status) {
        console.log(status);
      return statusOptions[status ? 1 : 0];
    },
  },
    data() {
        return {
            list: [],
            listLoading: true,
            detailLoading: false,
            detail: {
              id: 0,
              created_time: "",
              title: "",
              description: "",
              cover_img: "",
              genre: 0,
              is_visible: 1,
              serial_number: "",
            },
            listQuery: {
              course_id: id,
              page: 1,
            },
            statusOptions,
};
    },
  created() {
    this.getData();
    this.getList();
 },
  methods: {
      getData() {
          this.detailLoading = true;
          fetchCourseDetail({
            id,
          })
            .then((res) => {
                this.detail = res.data;
            })
            .finally(() => {
              this.detailLoading = false;
            });
      },
      addLecture() {},
      async getList() {
          this.listLoading = true;
          const { data } = await fetchCourseLectures(this.listQuery);
          this.list = data;
          this.listLoading = false;


      },
      changeCourseStatus() {},
  },
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
