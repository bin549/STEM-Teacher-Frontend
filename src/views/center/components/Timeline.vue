<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) of timeline"
        :key="index"
        :timestamp="item.timestamp | parseTime"
        placement="top"
      >
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { fetchActivityLog } from "@/api/activity";
import { parseTime } from "@/utils";

export default {
  data() {
    return {
      timeline: [],
    };
  },
  created() {
    this.fetchActivityLog();
  },
  methods: {
    fetchActivityLog() {
      fetchActivityLog()
        .then((res) => {
          this.timeline = res.data;
        })
        .finally(() => {});
    },
  },
};
</script>
