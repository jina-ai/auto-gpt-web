<template>
  <!-- TODO: render in a nicer way -->
  <Markdown class="chat-item-content" :source="content"></Markdown>
</template>

<script lang="ts" setup>
import Markdown from 'vue3-markdown-it';

defineProps({
  content: {
    type: String,
    required: true,
  },
});
</script>
