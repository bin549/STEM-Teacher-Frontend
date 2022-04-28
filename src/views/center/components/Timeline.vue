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
          timestamp: "2019/4/23 20:46",
          title: "活动完成(浮上来，沉下去)",
          content: "普京的作业已提交",
        },
        {
            timestamp: "2019/4/23 20:46",
          title: "活动评优(浮上来，沉下去)",
          content: "普京的作业被评优",
        },
        {
            timestamp: "2019/4/23 20:46",
          title: "活动超时(浮上来，沉下去)",
          content: "普京的作业未提交",
        },
      ],
    };
  },
};
</script>
