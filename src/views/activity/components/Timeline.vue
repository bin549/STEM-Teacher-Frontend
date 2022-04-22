<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) of timeline"
        :key="index"
        :timestamp="item.timestamp"
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
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: "2019/4/20",
          title: "提交作业",
          content: "普京 于 2019/4/23 20:46 成功种树",
        },
        {
          timestamp: "2019/4/21",
          title: "提交作业提交作业",
          content: "普京 于 2019/4/23 20:46 成功种树",
        },
        {
          timestamp: "2019/4/22",
          title: "提交作业",
          content: "普京 于 2019/4/23 20:46 成功种树",
        },
        {
          timestamp: "2019/4/23",
          title: "提交作业",
          content: "普京 于 2019/4/23 20:46 成功种树",
        },
      ],
    };
  },
};
</script>
