//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const grid_view = ref(false)
    const has_config_changed = ref(false)
    const headscale_version = ref('')
    return { grid_view, has_config_changed, headscale_version }
  },
  { persist: true },
)
