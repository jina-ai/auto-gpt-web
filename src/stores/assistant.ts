import { defineStore } from 'pinia';
import { prompt } from '../prompt';

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
        name: 'ChefGPT',
        role: 'an AI designed to browse the web to discover the next upcoming event and invent a unique and original recipe that would suit it.',
        goals: [
          'Invent an original and out-of-the-box recipe to suit a current event, such as Easter.',
          'Save the resulting recipe to a file.',
          'Shutdown upon achieving the goal.'
        ]
      };
    },
    prompt(state) {
      let fullPrompt = `You are ${state.name}, ${state.role}\nYour decisions must always be made independently without seeking user assistance. Play to your strengths as an LLM and pursue simple strategies with no legal complications.\n\nGOALS:\n\n`
      this.goals.forEach((goal, index) => {
        fullPrompt += `${index + 1}. ${goal}\n`
      })

      fullPrompt += '\n';
      fullPrompt += prompt;
      return fullPrompt;
    },
    completed(state) {
      return state.name && state.role && state.goals.length >= 1 && state.goals[0];
    }
  },
  actions: {
    addGoal() {
      this.goals.push('');
    },
    removeGoal(index: number) {
      this.goals.splice(index, 1);
    },
    setDemoAssistant() {
      this.name = this.demo.name;
      this.role = this.demo.role;
      this.goals = this.demo.goals;
    }
  },
  persist: true,
});
