<template>
  <div id="app">
    <div v-if="isLoading">
      <BaseSpinner></BaseSpinner>
    </div>
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import BaseSpinner from "@/components/ui/BaseSpinner.vue";

export default {
  name: "App",
  components: {
    BaseSpinner,
  },
  data() {
    return {
      isLoading: false,
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isLoading = true;
        setTimeout(() => {
          this.isRouterAlive = true;
          this.isLoading = false;
        }, 300);
      });
    },
    sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },
  },
};
</script>

<style>
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
dialog-footer ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
  margin-right: 30rem;
}
::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
</style>
