<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="20" style="margin-bottom: 30px">
      <el-col :span="12" :offset="0">
        <card-box title="常见功能" :list="list1"></card-box>
      </el-col>
      <el-col :span="12" :offset="0">
        <card-box title="其它功能" :list="list2"></card-box>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <newest-course></newest-course>
      </el-col>
      <el-col :span="12" :offset="0">
        <hotest-course></hotest-course>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardBox from "./components/CardBox";
import NewestCourse from "./components/NewestCourse";
import HotestCourse from "./components/HotestCourse";
// import Order from "./components/Order";

export default {
  name: "DashboardAdmin",
  components: {
    CardBox,
    NewestCourse,
    HotestCourse,
    // Order,
  },
  data() {
    return {
      list1: [
        {
          name: "课程管理",
          remark: "课程管理",
          icon: "el-icon-copy-document",
          path: "Column",
        },
        {
          name: "活动管理",
          remark: "活动管理",
          icon: "el-icon-microphone",
          path: "Activity",
        },
        {
          name: "学生管理",
          remark: "学生管理",
          icon: "el-icon-video-camera",
          path: "Student",
        },
        {
          name: "展示中心",
          remark: "展示中心",
          icon: "el-icon-goods",
          path: "Center",
        },
      ],
      list2: [
        {
          name: "待开发",
          remark: "待开发",
          icon: "el-icon-copy-document",
          path: "/#/dashboard",
        },
        {
          name: "待开发",
          remark: "待开发",
          icon: "el-icon-microphone",
          path: "/#/dashboard",
        },
        {
          name: "待开发",
          remark: "待开发",
          icon: "el-icon-video-camera",
          path: "/#/dashboard",
        },
        {
          name: "待开发",
          remark: "待开发",
          icon: "el-icon-goods",
          path: "/#/dashboard",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
