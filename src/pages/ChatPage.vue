<template>
  <q-page class="column items-center justify-evenly">
    <div class="container">
      <q-chat-message v-for="{ id, role, content, stamp } in chatStore.history" :key="id" :name="roleToDisplayName[role]"
        :avatar="roleToAvatarLink[role]" :sent="role === 'user'" :stamp="dayjs(stamp).fromNow()" size="8">
        <ChatItem :content="content" />
      </q-chat-message>

      <!-- Waiting status -->
      <q-chat-message v-if="chatStore.thinking" :name="assistantStore.name" :avatar="roleToAvatarLink['assistant']">
        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';

import { exec } from '../cmds';
import { useAssistantStore } from '../stores/assistant';
import { useChatStore } from '../stores/chat';
import ChatItem from '../components/ChatItem.vue';

const router = useRouter();
const assistantStore = useAssistantStore();
const chatStore = useChatStore();

// Return to homepage if assistant is not completed
if (!assistantStore.completed) {
  router.push('/')
}

// If there is no history, add the basic prompt
if (!chatStore.hasHistory) {
  chatStore.addBasicPrompt(assistantStore.prompt);
}

let a = 3;
onMounted(async () => {
  const raw = await chatStore.chat();

  while (a > 0) {
    const result = await exec(raw);

    await chatStore.chat([{
      role: 'system',
      content: result ? `Command returned: ${result}` : 'Unable to execute command',
    }, {
      role: 'user',
      content: 'Determine which next command to use, and respond using the format specified above:',
    }])

    a--;
  }
})

const roleToDisplayName = {
  user: 'me',
  system: 'system',
  assistant: assistantStore.name,
}

const roleToAvatarLink = {
  user: 'https://cdn.quasar.dev/img/avatar1.jpg',
  system: 'https://cdn.quasar.dev/img/avatar2.jpg',
  assistant: 'https://cdn.quasar.dev/img/avatar3.jpg',
}
</script>

<style scoped lang="scss">
.container {
  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  width: 80%;
}
</style>
