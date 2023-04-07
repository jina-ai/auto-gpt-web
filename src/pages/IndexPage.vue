<template>
  <q-page class="column items-center justify-evenly" padding>
    <header class="header">
      <div class="title">Accomplish Task Autonomously</div>
      <div class="description">Your AI assistant will recursively use tools (e.g. search...) to achieve your goals as much
        as possible.</div>
    </header>
    <q-card>
      <q-card-section>
        <span>Define your AI assistant</span>
        <q-input filled v-model="name" label="Name" :placeholder="demo.name" hint="Give your AI an meaningful name"
          :hide-hint="true" />
        <q-input filled v-model="role" label="Role" :placeholder="demo.role" hint="Describe the role of your AI"
          :hide-hint="true" />
        <span>Define major goals of your AI assistant</span>
        <div class="goal" v-for="(goal, index) in goals" :key="`goal_${index}`">
          <q-input filled v-model="goals[index]" :label="`Goal ${index + 1}`" />
          <q-icon size="1.6rem" color="primary" name="add_circle_outline" @click="assistantStore.addGoal()"></q-icon>
          <q-icon size="1.6rem" color="red" name="remove_circle_outline" v-show="goals.length > 1"
            @click="assistantStore.removeGoal(index)"></q-icon>
        </div>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat color="secondary" title="Fill in demo values" @click="assistantStore.setDemoAssistant()">Demo
          values</q-btn>
        <q-btn flat color="primary" title="Run the task" @click="run">Run</q-btn>
      </q-card-actions>
    </q-card>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Please provide credentials</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="openai" label="OpenAI API Key" placeholder="sk-..." type="password" />
          <q-input dense v-model="google.key" label="Google API Key" type="password" />
          <q-input dense v-model="google.engine" label="Google custom search engine id" type="password" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Add" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAssistantStore } from '../stores/assistant';
import { useCredentialStore } from '../stores/credential';

const router = useRouter();
const assistantStore = useAssistantStore();
const credentialStore = useCredentialStore();
const { name, role, goals, demo } = storeToRefs(assistantStore);
const { openai, google } = storeToRefs(credentialStore);

const run = () => {
  router.push('/chat');
}

const prompt = ref(credentialStore.requireOpenAICredential);
</script>

<style scoped lang="scss">
.q-card {
  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  width: 50%;

  .q-input {
    margin: 0.5rem;
  }
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;

  .title {
    font-size: 2rem;
    font-weight: bold;
  }

  .description {
    font-size: 1rem;
  }
}

.goal {
  display: flex;
  align-items: center;

  .q-input {
    width: 100%;
  }

  .q-icon {
    margin: 0.25rem;
    cursor: pointer;
  }
}
</style>
