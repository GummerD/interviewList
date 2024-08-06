import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userId = ref<string>('some-id-first');

  return {
    userId
  }
  
})
