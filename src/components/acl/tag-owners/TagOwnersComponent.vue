<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="tag_owners"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    :title="$q.screen.gt.sm ? 'Tag Owners' : ''"
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
        :label="$q.screen.gt.sm ? 'New Tag' : ''"
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
        <q-td
          ><template v-for="group in props.row.groups" :key="group.name">
            <q-badge
              outline
              color="primary"
              :label="group.name"
              class="q-mr-sm"
            /> </template
        ></q-td>
        <q-td key="actions" :props="props">
          <q-btn flat round color="secondary" icon="edit" dense>
            <q-tooltip>Edit Tag</q-tooltip>
          </q-btn>
          <q-btn flat round color="negative" icon="delete" dense>
            <q-tooltip>Delete Tag</q-tooltip>
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
                <q-tooltip>Edit Tag</q-tooltip>
              </q-btn>
              <q-btn icon="delete" color="negative" round flat dense>
                <q-tooltip>Delete Tag</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <template v-for="group in props.row.groups" :key="group.name">
              <q-badge
                outline
                color="primary"
                :label="group.name"
                class="q-mr-sm"
              />
            </template>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>
<script lang="ts" setup>
import { QTableColumn } from 'quasar'

const { grid_view } = storeToRefs(useSettingsStore())
const filter = ref('')
const { tag_owners } = storeToRefs(useAclsStore())
const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'groups',
    required: true,
    label: 'Groups',
    format: (val) => val.name,
    field: 'groups',
    align: 'left',
  },
  {
    name: 'actions',
    required: true,
    label: 'Actions',
    field: 'action',
    align: 'right',
  },
])
</script>
