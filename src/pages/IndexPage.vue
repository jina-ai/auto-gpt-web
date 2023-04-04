<template>
  <q-page class="column items-center justify-evenly">
    <h3 class="title">
      <strong>Run GPT-4 Autonomously</strong>
    </h3>
    <q-card>
      <q-card-section>
        <span>Define your AI assistant</span>
        <q-input filled v-model="name" label="Name" :placeholder="DEMO.name" hint="Give your AI an meaningful name" :hide-hint="true" />
        <q-input filled v-model="role" label="Role" :placeholder="DEMO.role" hint="Describe the role of your AI" :hide-hint="true" />
        <span>Define major goals of your AI assistant</span>
        <div class="goal" v-for="(goal, index) in goals" :key="`goal_${index}`">
          <q-input filled v-model="goals[index]" :label="`Goal ${index + 1}`" />
          <q-icon size="1.6rem" color="primary" name="add_circle_outline" @click="addGoal()"></q-icon>
          <q-icon size="1.6rem" color="red" name="remove_circle_outline" v-show="goals.length > 1" @click="removeGoal(index)"></q-icon>
        </div>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn flat color="secondary" title="Fill in demo values" @click="fillIn">Demo values</q-btn>
        <q-btn flat color="primary" title="Run the task" @click="run">Run</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const DEMO = {
  name: 'Entrepreneur-GPT',
  role: 'an AI designed to autonomously develop and run business with the sole goal of increasing your net worth.',
  goals: [
    'Invent an original and out-of-the-box recipe to suit a current event, such as Easter.',
    'Save the resulting recipe to a file.',
    'Shutdown upon achieving the goal.'
  ]
}

const name = ref('');
const role = ref('');
const goals = ref<string[]>(['']);

const addGoal = () => {
  goals.value.push('');
}

const removeGoal = (index: number) => {
  goals.value.splice(index, 1);
}

const fillIn = () => {
  name.value = DEMO.name;
  role.value = DEMO.role;
  goals.value = DEMO.goals;
}

const run = () => {
  // TODO: implement
  console.log(`name: ${name.value}`);
  console.log(`role: ${role.value}`);
  console.log(`goals: ${goals.value}`);
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
