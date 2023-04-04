<template>
  <q-page class="column items-center justify-evenly">
    <header class="header">
      <div class="title">Accomplish Task Autonomously</div>
      <div class="description">Your AI assistant will recursively use tools (e.g. search...) to achieve your goals as much as possible.</div>
    </header>
    <q-card>
      <q-card-section>
        <span>Define your AI assistant</span>
        <q-input filled v-model="name" label="Name" :placeholder="demo.name" hint="Give your AI an meaningful name" :hide-hint="true" />
        <q-input filled v-model="role" label="Role" :placeholder="demo.role" hint="Describe the role of your AI" :hide-hint="true" />
        <span>Define major goals of your AI assistant</span>
        <div class="goal" v-for="(goal, index) in goals" :key="`goal_${index}`">
          <q-input filled v-model="goals[index]" :label="`Goal ${index + 1}`" />
          <q-icon size="1.6rem" color="primary" name="add_circle_outline" @click="assistantStore.addGoal()"></q-icon>
          <q-icon size="1.6rem" color="red" name="remove_circle_outline" v-show="goals.length > 1" @click="assistantStore.removeGoal(index)"></q-icon>
        </div>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat color="secondary" title="Fill in demo values" @click="assistantStore.setDemoAssistant()">Demo values</q-btn>
        <q-btn flat color="primary" title="Run the task" @click="run">Run</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAssistantStore } from '../stores/assistant';

const assistantStore = useAssistantStore();
const { name, role, goals, demo } = storeToRefs(assistantStore);

const run = () => {
  // Save assistant configuration
  assistantStore.setAssistant({
    name: name.value,
    role: role.value,
    goals: goals.value
  });

  // TODO: implement
}
</script>

<style scoped lang="scss">
.q-page {
  padding: 20px;
  background: rgb(255, 186, 0);
  background: linear-gradient(135deg, rgba(255, 186, 0, 1) 0%, rgba(16, 168, 168, 1) 46%, rgba(198, 24, 175, 1) 100%);
}

.q-card {
  @media screen and (max-width: 1024px) {
    width: 100%;
  }

  width: 50%;
  padding: 0.5rem;

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
