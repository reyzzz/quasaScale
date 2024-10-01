import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore(
  'config',
  () => {
    const headscale_url = ref('')
    const quasascale_backend_url = ref('')
    const headscale_api_key = ref('')
    const headscale_instance_id = ref(0)
    return {
      headscale_api_key,
      headscale_url,
      quasascale_backend_url,
      headscale_instance_id,
    }
  },
  { persist: true },
)
