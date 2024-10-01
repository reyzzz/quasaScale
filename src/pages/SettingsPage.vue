<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      title="Headscale Instances"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
      :rows="headscale_instances"
      :columns="cols"
      row-key="name"
      :filter="filter"
      :pagination="{ rowsPerPage: 0 }"
      flat
      bordered
      hide-pagination
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
          color="white"
          class="q-mr-xl"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          icon="add"
          :label="$q.screen.gt.sm ? 'New Headscale' : ''"
          color="primary"
          outline
          :dense="$q.screen.lt.sm"
          @click="addHeadscaleInstance"
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.id }}</q-td>
          <q-td
            ><div class="row items-center gap-4px">
              <span class="relative flex h-3 w-3" v-if="props.row.active">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ade25d]"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
                ></span>
              </span>
              {{ props.row.headscale_url }}
            </div>
          </q-td>
          <q-td>{{ props.row.quasascale_backend_url }}</q-td>
          <q-td>{{ props.row.headscale_api_key }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn
              flat
              round
              size="sm"
              color="positive"
              dense
              class="q-ml-md i-majesticons:rocket-3-start-line"
              @click="activateHeadscale(props.row)"
            >
              <q-tooltip> Activate Headcale </q-tooltip>
            </q-btn>
            <q-btn
              icon="edit"
              flat
              round
              color="secondary"
              dense
              class="q-ml-md"
              @click="editHeadscaleInstance(props.row, props.rowIndex)"
            >
              <q-tooltip> Edit Instance </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              flat
              round
              color="negative"
              dense
              class="q-ml-md"
              @click="deleteHeadscaleInstance(props.rowIndex)"
            >
              <q-tooltip> Delete Instance </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #item="props">
        <q-card flat bordered class="rounded-xl">
          <q-card-section class="q-pb-xs">
            <div class="row q-mb-sm justify-between">
              <div class="text-h5 row items-center gap-5px">
                <span class="relative flex h-3 w-3" v-if="props.row.active">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ade25d]"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
                  ></span>
                </span>
                {{ props.row.headscale_url }}
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list style="width: max-content">
                    <q-item clickable @click="activateHeadscale(props.row)">
                      <q-item-section class="text-positive"
                        >Activate Headscale</q-item-section
                      >
                    </q-item>
                    <q-item
                      clickable
                      @click="editHeadscaleInstance(props.row, props.rowIndex)"
                    >
                      <q-item-section class="text-primary">
                        Edit Instance
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item
                      clickable
                      @click="deleteHeadscaleInstance(props.rowIndex)"
                    >
                      <q-item-section class="text-negative"
                        >Delete Instance</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div>
              <span class="text-weight-bold text-accent"> API Key: </span>
              <span
                class="text-info hover:cursor-pointer"
                @click="copyAPIKey(props.row.headscale_api_key)"
                >{{ chopAPIKey(props.row.headscale_api_key) }}
              </span>
            </div>

            <div class="q-my-sm">
              <span class="text-weight-bold text-accent"> Quasacale URL: </span>
              <span class="text-info"
                >{{ props.row.quasascale_backend_url }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import { db } from 'src/boot/db'
import HeadscaleInstanceConfiguration from 'src/components/HeadscaleInstanceConfiguration.vue'
import { HeadscaleInstance } from 'src/types/Database'

const { grid_view } = storeToRefs(useSettingsStore())
const {
  quasascale_backend_url,
  headscale_url,
  headscale_api_key,
  headscale_instance_id,
} = storeToRefs(useConfigStore())
const filter = ref('')
const headscale_instances = ref<HeadscaleInstance[]>([])
const cols = ref<QTableColumn[]>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    field: 'id',
    align: 'left',
  },
  {
    name: 'headscale_url',
    required: true,
    label: 'Headscale URL',
    field: 'headscale_url',
    align: 'left',
  },
  {
    name: 'quasascale_backend_url',
    required: true,
    label: 'Quasacale Backend URL',
    field: 'quasascale_backend_url',
    align: 'left',
  },
  {
    name: 'headscale_api_key',
    required: true,
    label: 'Headscale API Key',
    field: 'headscale_api_key',
    align: 'left',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    field: 'actions',
    align: 'right',
  },
])

async function addHeadscaleInstance(): Promise<void> {
  const headscale_instance: Partial<HeadscaleInstance> = {
    headscale_api_key: '',
    headscale_url: '',
    quasascale_backend_url: '',
  }
  useDialog()
    .show(HeadscaleInstanceConfiguration, {
      headscale_instance: headscale_instance,
    })
    .onOk(async (data: HeadscaleInstance) => {
      try {
        const id = await db.headscale_instances.add({
          active: false,
          headscale_api_key: data.headscale_api_key,
          headscale_url: data.headscale_url,
          quasascale_backend_url: data.quasascale_backend_url,
        })
        data.id = id
        headscale_instances.value.push(data)
        useNotify('Headscale instance added successfully', 'check')
      } catch (error) {
        useNotify(
          'An Error has occured while adding the headscale instance',
          'warning',
          'negative',
        )
      }
    })
  return
}

async function deleteHeadscaleInstance(index: number): Promise<void> {
  useDialog()
    .del()
    .onOk(async () => {
      try {
        const headscale_instance = headscale_instances.value[index]
        await db.headscale_instances.delete(headscale_instance.id)
        if (headscale_instance_id.value === headscale_instance.id) {
          headscale_api_key.value = ''
          headscale_url.value = ''
          quasascale_backend_url.value = ''
          headscale_instance_id.value = 0
        }
        headscale_instances.value.splice(index, 1)
        useNotify('Headscale instance deleted successfully', 'check')
      } catch (error) {
        useNotify(
          'An Error has occured while deleting this headscale instance',
          'warning',
          'negative',
        )
      }
    })
}
async function editHeadscaleInstance(
  headscale_instance: HeadscaleInstance,
  index: number,
) {
  useDialog()
    .show(HeadscaleInstanceConfiguration, {
      headscale_instance: headscale_instance,
    })
    .onOk(async (data: HeadscaleInstance) => {
      try {
        await db.headscale_instances.update(headscale_instance.id, {
          active: data.active,
          headscale_api_key: data.headscale_api_key,
          headscale_url: data.headscale_url,
          quasascale_backend_url: data.quasascale_backend_url,
        })
        headscale_instances.value[index] = data
        if (data.id === headscale_instance_id.value) {
          headscale_api_key.value = data.headscale_api_key
          headscale_url.value = data.headscale_url
          quasascale_backend_url.value = data.quasascale_backend_url || ''
        }
        useNotify('Headscale instance updated successfully', 'check')
      } catch (error) {
        useNotify(
          'An Error has occured while updating this headscale instance',
          'warning',
          'negative',
        )
      }
    })
}
async function activateHeadscale(headscale: HeadscaleInstance) {
  let instance = headscale_instances.value.find((instance) => {
    return instance.id === headscale_instance_id.value
  })
  if (instance) {
    instance.active = false
    await db.headscale_instances.update(instance.id, {
      active: false,
    })
  }

  headscale_instance_id.value = headscale.id as number
  await db.headscale_instances.update(headscale.id, {
    active: true,
  })
  instance = headscale_instances.value.find((instance) => {
    return instance.id === headscale_instance_id.value
  })
  if (instance) instance.active = true

  headscale_api_key.value = headscale.headscale_api_key
  headscale_url.value = headscale.headscale_url
  quasascale_backend_url.value = headscale.quasascale_backend_url || ''
}
function chopAPIKey(api_key: string) {
  return (
    api_key.substring(0, 6) +
    '...' +
    api_key.substring(api_key.length - 4, api_key.length)
  )
}
function copyAPIKey(api_key: string) {
  navigator.clipboard.writeText(api_key)

  useNotify('API Key copied to clipboard', 'check')
}
onMounted(async () => {
  headscale_instances.value = await db.headscale_instances.toArray()
})
</script>
