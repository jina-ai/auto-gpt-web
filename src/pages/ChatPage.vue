<template>
  <q-page class="column items-center justify-evenly">
    <div class="container">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
        sent
        stamp="now"
        size="8"
      >
        <!-- TODO: render in a nicer way -->
        <div>{{  prompt }}</div>
      </q-chat-message>
      <q-chat-message
        :name="assistantStore.name"
        avatar="https://cdn.quasar.dev/img/avatar2.jpg"
        :text="[result]"
        stamp="now"
        size="8"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, h } from 'vue';
import { storeToRefs } from 'pinia';
import { chat } from '../ai';
import { useAssistantStore } from '../stores/assistant';

const assistantStore = useAssistantStore();
const { prompt } = storeToRefs(assistantStore);

const result = ref<string | undefined>(undefined);

onMounted(async () => {
  result.value = await chat({
    prompt: prompt.value,
    userInput: 'Determine which next command to use, and respond using the format specified above:',
    fullMessageHistory: [],
    permanentMemory: [],
  });
})
</script>

<style scoped lang="scss">
.container {
  width: 80%;
}
</style>
