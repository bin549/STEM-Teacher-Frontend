<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0' }">
      <div slot="header">
        <span>最热课程</span>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        :border="false"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="内容" min-width="180px">
          <template slot-scope="{ row }">
            <div style="display: flex">
              <img
                :src="row.id"
                style="width: 100px; height: 50px; margin-right: 10px"
                @click="checkCourse(row.id)"
                class="course_cover"
              />
              <div
                style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                "
              >
                <span>{{ row.title }}</span>
                <span style="color: red">￥{{ row.price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="选课人数" width="150px" align="center">
          <template slot-scope="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { fetchCourses } from "@/api/column";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      listLoading: false,
      list: [],
    };
  },
  computed: {
    ...mapGetters(["id"]),
  },
  created() {
    this.listLoading = true;
    fetchCourses({
      id: this.id,
      sort_by: "count",
    })
      .then((res) => {
        this.list = res.data;
      })
      .finally(() => {
        this.listLoading = false;
      });
  },
  methods: {
      checkCourse(course_id) {
          this.$router.push({
            name: "Lecture",
            query: {
              id: course_id,
            },
          });
      },
  },
};
</script>
<style lang="scss">
.course_cover {
    cursor: pointer;
    &:hover {
        opacity: 0.5;
    }
}
</style>
