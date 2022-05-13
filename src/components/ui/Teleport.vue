<script>
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  inject: ["parent"],
  watch: {
    disabled() {
      if (this.disabled) {
        // 把当前的DOM元素 向目标元素传送过去
        document.querySelector(this.to).appendChild(this.$el);
      } else {
        // 调用父组件的方法， 再将当前的DOM元素还原的原来的位置
        this.parent.toSourceDom(this.$el);
      }
    },
  },
  mounted() {
    if (this.disabled) document.querySelector(this.to).appendChild(this.$el);
  },
  render() {
    return <div class="Teleport">{this.$scopedSlots.default()}</div>;
  },
};
</script>

<style scoped>
.Teleport {
  width: 100%;
  height: 100%;
}
</style>
