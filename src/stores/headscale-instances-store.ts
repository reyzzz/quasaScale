import { defineStore } from 'pinia'
import { db } from 'src/boot/db'
import { QuasascaleInstance } from 'src/types/Database'

export const useHeadscaleInstancesStore = defineStore(
  'headscale-instances',
  () => {
    const { getUsers } = useUsersStore()
    const { headscale_version } = storeToRefs(useSettingsStore())
    const instances = ref<QuasascaleInstance[]>([])
    const active_headscale = computed(() =>
      instances.value.find((i) => i.active),
    )

    async function getHeadscaleInstances() {
      instances.value = await db.headscale_instances.toArray()
    }

    async function addHeadscaleInstance(headscale: QuasascaleInstance) {
      const headscale_instance_id = await db.headscale_instances.add({
        ...headscale,
      })
      await getHeadscaleInstances()
      if (instances.value.length === 1) {
        activateHeadscale({ ...headscale, id: headscale_instance_id })
      }
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
      try {
        const resp = await fetch(
          `${headscale.quasascale_backend_url}/version`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${headscale.headscale_api_key}`,
            },
          },
        )
        if (resp.status !== 200) {
          useNotify('Headscale instance not reachable', 'warning', 'negative')
          return
        }
        headscale_version.value = (await resp.json()).version

        if (active_headscale.value !== undefined)
          await db.headscale_instances.update(active_headscale.value.id, {
            active: false,
          })
        await db.headscale_instances.update(headscale.id, {
          active: true,
        })

        await getHeadscaleInstances()
        await getUsers()
      } catch (error) {
        useNotify('Headscale instance not reachable', 'warning', 'negative')
      }
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
