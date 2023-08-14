<template>
    <svg>
      <use :xlink:href="prefix + name"></use>
    </svg>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-'
  },
  //svg矢量图的名字
  name: String,
})
</script>
<style scoped>

</style>