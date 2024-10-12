<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      :title="$q.screen.lt.sm ? 'H. Inst.' : 'Headscale Instances'"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="title-text"
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
              <animated-circle v-if="props.row.active" />
              {{ props.row.name }}
            </div>
          </q-td>
          <q-td>{{ props.row.quasascale_backend_url }}</q-td>
          <q-td>
            <div
              @click="copyString(props.row.headscale_api_key)"
              class="hover:cursor:pointer"
            >
              {{ chopString(props.row.headscale_api_key) }}
            </div></q-td
          >
          <q-td key="actions" :props="props">
            <q-btn
              flat
              round
              color="positive"
              dense
              icon="majesticons:rocket-3-start-line"
              class="q-ml-md"
              :disable="props.row.active"
              @click="activateHeadscale(props.row)"
            >
              <q-tooltip> Activate Instance </q-tooltip>
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
          <q-card-section>
            <div class="row q-mb-sm justify-between">
              <div class="text-h5 row items-center gap-5px">
                <animated-circle v-if="props.row.active" />
                {{ props.row.name }}
              </div>
              <div class="row gap-2px">
                <q-btn
                  icon="edit"
                  color="secondary"
                  round
                  flat
                  dense
                  @click="update(props.row)"
                >
                  <q-tooltip>Edit Instance</q-tooltip>
                </q-btn>
                <q-btn
                  icon="delete"
                  color="negative"
                  round
                  flat
                  dense
                  @click="remove(props.row.id)"
                >
                  <q-tooltip>Delete Instance</q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row justify-between">
              <div class="column">
                <div>
                  <span class="text-weight-bold text-accent"> URL: </span>
                  <span class="text-info"
                    >{{ props.row.quasascale_backend_url }}
                  </span>
                </div>

                <div>
                  <span class="text-weight-bold text-accent"> API Key: </span>
                  <span
                    class="text-info hover:cursor-pointer"
                    @click="copyString(props.row.headscale_api_key)"
                    >{{ chopString(props.row.headscale_api_key) }}
                  </span>
                  <q-btn
                    icon="content_copy"
                    dense
                    round
                    flat
                    size="xs"
                    @click="copyString(props.row.headscale_api_key)"
                  />
                </div>
              </div>

              <div class="column justify-end">
                <q-btn
                  round
                  dense
                  flat
                  color="positive"
                  icon="majesticons:rocket-3-start-line"
                  @click="activateHeadscale(props.row)"
                  :disable="props.row.active"
                >
                  <q-tooltip> Activate Instance </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'
import HeadscaleInstanceConfiguration from 'src/components/headscale-instances/HeadscaleInstanceConfiguration.vue'
import { QuasascaleInstance } from 'src/types/Database'

const { grid_view } = storeToRefs(useSettingsStore())
const { instances } = storeToRefs(useHeadscaleInstancesStore())
const { chopString, copyString } = useUtils()

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
    .onOk(async (data: QuasascaleInstance) => {
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
    .del('Are you sure you want to delete this headscale instance?')
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
async function update(headscale_instance: QuasascaleInstance) {
  useDialog()
    .show(HeadscaleInstanceConfiguration, {
      headscale_instance,
    })
    .onOk(async (data: QuasascaleInstance) => {
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
</script>
