<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="groups"
    :columns="cols"
    row-key="name"
    :filter="filter"
    :pagination="{ rowsPerPage: 0 }"
    title="Groups"
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
        :label="$q.screen.gt.sm ? 'New Group' : ''"
        color="primary"
        outline
        :dense="$q.screen.lt.sm"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>{{ props.row.name }}</q-td>
        <q-td
          ><template v-for="user in props.row.users" :key="user.id">
            <q-badge
              outline
              color="primary"
              :label="user.name"
              class="q-mr-sm"
            /> </template
        ></q-td>
        <q-td key="actions" :props="props">
          <q-btn
            icon="edit"
            color="secondary"
            round
            dense
            flat
            @click="editGroup(props.row, props.rowIndex)"
          >
            <q-tooltip>Edit Group</q-tooltip>
          </q-btn>
          <q-btn icon="delete" color="negative" round flat dense>
            <q-tooltip>Delete Group</q-tooltip>
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
              <q-btn
                icon="edit"
                color="secondary"
                round
                flat
                dense
                @click="editGroup(props.row, props.rowIndex)"
              >
                <q-tooltip>Edit Group</q-tooltip>
              </q-btn>
              <q-btn icon="delete" color="negative" round flat dense>
                <q-tooltip>Delete Group</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <template v-for="user in props.row.users" :key="user.id">
              <q-badge
                outline
                color="primary"
                :label="user.name"
                class="q-mr-sm"
              />
            </template>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableColumn } from 'quasar'
import { Group } from 'src/types/Database'
import GroupsConfiguration from './GroupsConfiguration.vue'

const { grid_view } = storeToRefs(useSettingsStore())
const { groups } = storeToRefs(useAclsStore())
const filter = ref('')
const cols = ref<QTableColumn[]>([
  {
    name: 'name',
    required: true,
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'users',
    required: true,
    format: (val) => val.name,
    label: 'Users',
    field: 'users',
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

function editGroup(group: Group, index: number) {
  useDialog()
    .show(GroupsConfiguration, {
      group: group,
    })
    .onOk((updatedGroup: Group) => {
      groups.value[index] = updatedGroup
    })
}
</script>
