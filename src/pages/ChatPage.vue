<template>
  <q-page class="column items-center justify-evenly" padding>
    <div class="container" ref="containerRef">
      <q-chat-message v-for="{ id, role, content, stamp } in chatStore.history" :key="id" :name="roleToDisplayName[role]"
        :avatar="roleToAvatarLink[role]" :sent="role === 'user'" :stamp="dayjs(stamp).fromNow()" size="8">
        <ChatItem :content="content" />
      </q-chat-message>

      <!-- Waiting for AI -->
      <q-chat-message v-if="thinking" :name="roleToDisplayName['assistant']" :avatar="roleToAvatarLink['assistant']">
        <q-spinner-dots size="2rem" />
      </q-chat-message>

      <!-- Waiting for system -->
      <q-chat-message v-if="executing" :name="roleToDisplayName['system']" :avatar="roleToAvatarLink['system']">
        <q-spinner-gears size="2rem" />
      </q-chat-message>

      <!-- Waiting for user's decision -->
      <q-chat-message v-if="deciding" :name="roleToDisplayName['user']" :avatar="roleToAvatarLink['user']" sent size="4">
        <div>
          <q-spinner-rings size="2rem" />
          <q-btn flat @click="moveOn()">move on!</q-btn>
        </div>
      </q-chat-message>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab v-model="fabRight" vertical-actions-align="right" color="primary" icon="keyboard_arrow_up" direction="up">
        <q-fab-action label-position="left" color="red" @click="resetChatHistory()" icon="restart_alt"
          label="Reset chat history" />
        <q-fab-action label-position="left" color="red" @click="resetAssistant()" icon="smart_toy"
          label="Reset assistant" />
        <q-fab-action label-position="left" color="red" @click="resetCredentials()" icon="key"
          label="Reset credentials" />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useQuasar, scroll } from 'quasar'

import { useAssistantStore } from '../stores/assistant';
import { useChatStore } from '../stores/chat';
import ChatItem from '../components/ChatItem.vue';
import { useCredentialStore } from '../stores/credential';

const $q = useQuasar()
const router = useRouter();
const assistantStore = useAssistantStore();
const chatStore = useChatStore();
const credentialStore = useCredentialStore();
const { lastHistoryItem, deciding, thinking, executing } = storeToRefs(chatStore);

const roleToDisplayName = {
  user: 'ME',
  system: 'SYSTEM',
  assistant: assistantStore.name,
}

const roleToAvatarLink = {
  user: 'https://cdn.quasar.dev/img/avatar1.jpg',
  system: 'https://cdn.quasar.dev/img/avatar2.jpg',
  assistant: 'https://cdn.quasar.dev/img/avatar3.jpg',
}

// Return to homepage if assistant is not completed
if (!assistantStore.completed) {
  router.push('/')
} else if (!chatStore.hasHistory) {
  chatStore.addBasicPrompt(assistantStore.prompt);
}

const moveOn = async () => {
  deciding.value = false;

  try {
    await chatStore.exec();
    await chatStore.chat([{
      role: 'user',
      content: 'Generate next command json',
    }])
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
      return;
    }

    $q.notify({
      type: 'negative',
      message: `Unknown error: ${e}`,
    });
  }
}

onMounted(async () => {
  scrollToBottom();

  try {
    if (lastHistoryItem.value?.role && ['user', 'system'].includes(lastHistoryItem.value?.role)) {
      await chatStore.chat();
    }
  } catch (e) {
    if (e instanceof Error) {
      $q.notify({
        type: 'negative',
        message: e.message,
      });
      return;
    }

    $q.notify({
      type: 'negative',
      message: `Unknown error: ${e}`,
    });
  }
})

const containerRef = ref<HTMLDivElement | null>(null);
const scrollToBottom = () => {
  if (containerRef.value) {
    const target = scroll.getScrollTarget(containerRef.value);
    const offset = containerRef.value.scrollHeight;
    const duration = 1000;
    scroll.animVerticalScrollTo(target, offset, duration);
  }
}

watch(chatStore, () => {
  scrollToBottom();
}, {
  deep: true
});

const fabRight = ref(false);
const resetChatHistory = () => {
  fabRight.value = false;
  chatStore.$reset();
  location.reload();
}
const resetAssistant = () => {
  fabRight.value = false;
  chatStore.$reset();
  assistantStore.$reset();
  location.reload();
}
const resetCredentials = () => {
  fabRight.value = false;
  chatStore.$reset();
  assistantStore.$reset();
  credentialStore.$reset();
  location.reload();
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
