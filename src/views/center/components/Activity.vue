<template>
  <div class="user-activity">
    <ActivityExecution
      v-for="execution in executions"
      v-bind:execution="execution"
    >
    </ActivityExecution>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ActivityExecution from "@/components/activity/ActivityExecution.vue";

import { fetchExecutions } from "@/api/activity.js";

export default {
  data() {
    return {
      executions: [],
    };
  },
  created() {
    this.fetchExecutions();
  },
  components: {
    ActivityExecution,
  },
  computed: {
    ...mapGetters(["id"]),
  },
  methods: {
    fetchExecutions() {
      fetchExecutions({
        owner_id: this.id,
        is_excellent: true,
      })
        .then((response) => {
          this.executions = response.data;
        })
        .finally(() => {});
    },
  },
};
</script>

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
