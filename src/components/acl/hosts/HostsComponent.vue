<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="hosts"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    title="Hosts"
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
        :label="$q.screen.gt.sm ? 'New Host' : ''"
        color="primary"
        outline
        :dense="$q.screen.lt.sm"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          {{ props.row.name }}
        </q-td>
        <q-td>
          {{ props.row.IP_address }}
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat round color="secondary" icon="edit" dense>
            <q-tooltip>Edit Host</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" dense>
            <q-tooltip>Delete Host</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <template #item="props">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row q-mb-sm justify-between">
            <div class="text-h5 row">
              {{ props.row.name }}
            </div>
            <div>
              <q-btn icon="edit" color="secondary" round flat dense>
                <q-tooltip>Edit Host</q-tooltip>
              </q-btn>
              <q-btn icon="delete" color="negative" round flat dense>
                <q-tooltip>Delete Host</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <span class="text-weight-bold text-accent">IP Address: </span>
            <span class="text-info">{{ props.row.IP_address }}</span>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar'

const { grid_view } = storeToRefs(useSettingsStore())
const { hosts } = storeToRefs(useAclsStore())
const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'IP_address',
    required: true,
    label: 'IP Address',
    field: 'IP_address',
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
const filter = ref('')
</script>
