//create pinia store called useLogsStore
import { defineStore } from 'pinia'
import { db } from 'src/boot/db'
import { QuasascaleInstance } from 'src/types/Database'
import { ref } from 'vue'

export const useHeadscaleInstancesStore = defineStore(
  'headscale-instances',
  () => {
    const instances = ref<QuasascaleInstance[]>([])
    const active_headscale = computed(() =>
      instances.value.find((i) => i.active),
    )

    async function getHeadscaleInstances() {
      instances.value = await db.headscale_instances.toArray()
    }

    async function addHeadscaleInstance(headscale: QuasascaleInstance) {
      await db.headscale_instances.add({ ...headscale })
      await getHeadscaleInstances()
    }

    async function deleteHeadscaleInstance(id: number) {
      await db.headscale_instances.delete(id)
      await getHeadscaleInstances()
    }

    async function updateHeadscaleInstance(headscale: QuasascaleInstance) {
      await db.headscale_instances.update(headscale.id, { ...headscale })
      await getHeadscaleInstances()
    }

    async function activateHeadscale(headscale: QuasascaleInstance) {
      if (active_headscale.value !== undefined)
        await db.headscale_instances.update(active_headscale.value.id, {
          active: false,
        })
      await db.headscale_instances.update(headscale.id, {
        active: true,
      })
      await getHeadscaleInstances()
    }

    return {
      instances,
      active_headscale,
      getHeadscaleInstances,
      addHeadscaleInstance,
      deleteHeadscaleInstance,
      updateHeadscaleInstance,
      activateHeadscale,
    }
  },
)
