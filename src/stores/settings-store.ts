//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const grid_view = ref(false)
    return { grid_view }
  },
  { persist: true },
)
