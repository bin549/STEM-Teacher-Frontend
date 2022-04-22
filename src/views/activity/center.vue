<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="13" :xs="24">
            <activity />
        </el-col>
        <el-col :span="11" :xs="24">
          <el-card>
              <timeline />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Activity from "./components/Activity";
import Timeline from "./components/Timeline";

export default {
  name: "center",
  components: { Activity, Timeline },
  data() {
    return {
      user: {},
    };
  },
  computed: {
    ...mapGetters(["id", "name", "avatar", "roles"]),
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      this.user = {
        id: this.id,
        name: this.name,
        role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar,
      };
    },
  },
};
</script>
