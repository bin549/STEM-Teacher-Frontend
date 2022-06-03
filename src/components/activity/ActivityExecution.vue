<template>
  <div class="post">
    <div class="user-block" v-if="!!user">
      <img class="img-circle" :src="user.get_image" />
      <span class="username text-muted">{{ user.name }}</span>
      <span class="description"
        >发布于 - {{ execution.finish_time | parseTime }}</span
      >
    </div>
    <p>
      {{ execution.content_text }}
    </p>
    <div class="user-images" v-if="!!execution_medias.length">
      <el-carousel :interval="6000" type="card" height="170px">
        <el-carousel-item
          v-for="(item, index) in execution_medias"
          :key="index"
        >
          <el-image :src="item.get_media" class="image"
              @click="previewImage(item.get_media, index)"
              :preview-src-list="srcList"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
const avatarPrefix = "?imageView2/1/w/80/h/80";
const carouselPrefix = "?imageView2/2/h/440";

import { fetchExecutionMedias } from "@/api/activity.js";
import { parseTime } from "@/utils";
import { fetchStudent } from "@/api/user.js";

export default {
  data() {
    return {
      execution_medias: [],
      avatarPrefix,
      carouselPrefix,
      user: null,
      previewMedia: false,
      srcList: [],
    };
  },
  props: {
    execution: Object,
  },
  mounted() {
    this.fetchExecutionImages();
    this.fetchStudent();
  },
  methods: {
      previewImage(media, index) {
          this.previewMedia = this.srcList[index];
      },
    fetchExecutionImages() {
      fetchExecutionMedias({
        id: this.execution.id,
      }).then((response) => {
        this.execution_medias = response.data;
        for (var i = 0; i < this.execution_medias.length; i++) {
          this.srcList.push(this.execution_medias[i]["media"]);
        }
      });
    },
    fetchStudent() {
      fetchStudent({
        student_id: this.execution.user,
      }).then((response) => {
        this.user = response.data;
      });
    },
  },
};
</script>

<style>
.el-carousel__indicators--outside {
    margin-top: 20px;
}
</style>

<style lang="scss" scoped>
.user-activity {
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }
    .username {
      font-size: 16px;
      color: #000;
    }
    :after {
      clear: both;
    }
    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }
    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
  .post {
    font-size: 15px;
    border-bottom: 1px solid #d2d6de;
    margin-bottom: 40px;
    padding-bottom: 15px;
    color: #666;
    .image {
      width: 100%;
      height: 100%;
    }
    .user-images {
      padding-top: 20px;
    }
  }
  .list-inline {
    padding-left: 0;
    margin-left: -5px;
    list-style: none;
    li {
      display: inline-block;
      padding-right: 5px;
      padding-left: 5px;
      font-size: 13px;
    }
    .link-black {
      &:hover,
      &:focus {
        color: #999;
      }
    }
  }
}
.box-center {
  margin: 0 auto;
  display: table;
}
.text-muted {
  color: #777;
}
</style>
