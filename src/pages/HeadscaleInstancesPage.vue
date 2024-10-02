<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      title="Headscale Instances"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
      :rows="instances"
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
          @click="add"
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.id }}</q-td>
          <q-td>
            <div class="row items-center gap-4px">
              <span class="relative flex h-3 w-3" v-if="props.row.active">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ade25d]"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
                ></span>
              </span>
              {{ props.row.name }}
            </div>
          </q-td>
          <q-td>{{ props.row.quasascale_backend_url }}</q-td>
          <q-td>{{ chopAPIKey(props.row.headscale_api_key) }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn
              flat
              round
              size="sm"
              color="positive"
              dense
              class="q-ml-md i-majesticons:rocket-3-start-line"
              :disable="props.row.active"
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
              @click="update(props.row)"
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
              @click="remove(props.row.id)"
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
                  >
                  </span>
                  <span
                    class="relative inline-flex rounded-full h-3 w-3 bg-[#ade25d]"
                  ></span>
                </span>
                {{ props.row.name }}
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list style="width: max-content">
                    <q-item clickable @click="activateHeadscale(props.row)">
                      <q-item-section class="text-positive">
                        Activate Instance
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="update(props.row)">
                      <q-item-section class="text-primary">
                        Edit Instance
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="remove(props.row.id)">
                      <q-item-section class="text-negative"
                        >Delete Instance</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="q-my-sm">
              <span class="text-weight-bold text-accent">
                Quasacale Backend URL:
              </span>
              <span class="text-info"
                >{{ props.row.quasascale_backend_url }}
              </span>
            </div>

            <div>
              <span class="text-weight-bold text-accent"> API Key: </span>
              <span
                class="text-info hover:cursor-pointer"
                @click="copyAPIKey(props.row.headscale_api_key)"
                >{{ chopAPIKey(props.row.headscale_api_key) }}
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
import HeadscaleInstanceConfiguration from 'src/components/HeadscaleInstanceConfiguration.vue'
import { HeadscaleInstance } from 'src/types/Database'

const { grid_view } = storeToRefs(useSettingsStore())
const { instances } = storeToRefs(useHeadscaleInstancesStore())
console.log(instances.value)
const {
  addHeadscaleInstance,
  updateHeadscaleInstance,
  deleteHeadscaleInstance,
  activateHeadscale,
} = useHeadscaleInstancesStore()
const filter = ref('')
const cols = ref<QTableColumn[]>([
  {
    name: 'id',
    required: true,
    label: 'ID',
    field: 'id',
    align: 'left',
  },
  {
    name: 'name',
    required: true,
    label: 'Headscale Name',
    field: 'name',
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

async function add(): Promise<void> {
  useDialog()
    .show(HeadscaleInstanceConfiguration, {
      headscale_instance: {
        headscale_api_key: '',
        headscale_url: '',
        quasascale_backend_url: '',
        name: '',
      },
    })
    .onOk(async (data: HeadscaleInstance) => {
      try {
        await addHeadscaleInstance(data)
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

async function remove(id: number): Promise<void> {
  useDialog()
    .del()
    .onOk(async () => {
      try {
        await deleteHeadscaleInstance(id)
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
async function update(headscale_instance: HeadscaleInstance) {
  useDialog()
    .show(HeadscaleInstanceConfiguration, {
      headscale_instance,
    })
    .onOk(async (data: HeadscaleInstance) => {
      try {
        await updateHeadscaleInstance(data)
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
</script>
