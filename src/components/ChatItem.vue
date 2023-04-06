<template>
  <!-- TODO: render in a nicer way -->
  <div>{{ content }}</div>
</template>

<script lang="ts" setup>
defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>
