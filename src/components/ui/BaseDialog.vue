<template>
  <Teleport to="body">
    <div v-if="show" @click="tryClose" class="backdrop"></div>
    <transition name="dialog">
      <dialog open v-if="show">
        <header>
          <slot name="header">
            <h2>{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot>
            <h2>{{ content }}</h2>
          </slot>
        </section>
        <menu>
          <slot name="actions">
            <button @click="tryClose">Close</button>
          </slot>
        </menu>
      </dialog>
    </transition>
  </Teleport>
</template>

<script>
import Teleport from "@/components/ui/Teleport.vue";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: { Teleport },
  provide() {
    return {
      parent: this,
    };
  },
  emits: ["close"],
  methods: {
    tryClose() {
      if (this.fixed) {
        return;
      }
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}
dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0;
  overflow: hidden;
  background-color: white;
}
header {
  background-color: #117abb;
  color: white;
  width: 100%;
  padding: 1rem;
  h2 {
    margin: 0;
  }
}
section {
  padding: 1rem;
}
menu {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
@media (min-width: 768px) {
  dialog {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}

button,
a {
  background-color: #1aa1f5;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font: inherit;
  border: 0.1rem solid #1aa1f5;
  width: 17rem;
  border-radius: 3rem;
  box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
  cursor: pointer;
  border-radius: 30px;
  display: flex;
  justify-content: center;
}
a:hover,
a:active,
button:hover,
button:active {
  background-color: #117abb;
  border-color: #270041;
}
</style>
