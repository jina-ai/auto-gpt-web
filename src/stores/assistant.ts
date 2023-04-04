import { defineStore } from 'pinia';

export interface Assistant {
  name: string;
  role: string;
  goals: string[];
}

export const useAssistantStore = defineStore('assistant', {
  state: (): Assistant => ({
    name: '',
    role: '',
    goals: [''],
  }),
  getters: {
    demo() {
      return {
        name: 'Entrepreneur-GPT',
        role: 'an AI designed to autonomously develop and run business with the sole goal of increasing your net worth.',
        goals: [
          'Invent an original and out-of-the-box recipe to suit a current event, such as Easter.',
          'Save the resulting recipe to a file.',
          'Shutdown upon achieving the goal.'
        ]
      };
    }
  },
  actions: {
    addGoal() {
      this.goals.push('');
    },
    removeGoal(index: number) {
      this.goals.splice(index, 1);
    },
    setAssistant(value: Assistant) {
      this.name = value.name;
      this.role = value.role;
      this.goals = value.goals;
    },
    setDemoAssistant() {
      this.name = this.demo.name;
      this.role = this.demo.role;
      this.goals = this.demo.goals;
    }
  },
});
