<template>
  <q-table
    :grid="grid_view || $q.screen.lt.sm"
    class="rounded-xl"
    table-header-class="text-[#929289] font-bold"
    title-class="title-text"
    :rows="groupsArray"
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
        @click="addGroup()"
      />
    </template>
    <template #body="props">
      <q-tr :props="props">
        <q-td>
          <span class="text-base">{{ props.row.name }}</span>
        </q-td>
        <q-td>
          <template v-for="user in props.row.users" :key="user.id">
            <q-badge
              outline
              color="primary"
              :label="user"
              class="q-mr-sm text-sm"
            />
          </template>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            icon="edit"
            color="secondary"
            round
            dense
            flat
            @click="editGroup(props.row)"
          >
            <q-tooltip>Edit Group</q-tooltip>
          </q-btn>
          <q-btn
            icon="delete"
            color="negative"
            round
            flat
            dense
            @click="deleteGroup(props.row)"
          >
            <q-tooltip>Delete Group</q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
    <template #item="props">
      <q-card flat bordered class="rounded-xl">
        <q-card-section>
          <div class="row q-mb-sm justify-between">
            <div class="text-h6">
              {{ props.row.name }}
            </div>
            <div>
              <q-btn
                icon="edit"
                color="secondary"
                round
                flat
                dense
                @click="editGroup(props.row)"
              >
                <q-tooltip>Edit Group</q-tooltip>
              </q-btn>
              <q-btn
                icon="delete"
                color="negative"
                round
                flat
                dense
                @click="deleteGroup(props.row)"
              >
                <q-tooltip>Delete Group</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div>
            <template v-for="user in props.row.users" :key="user.id">
              <q-badge
                outline
                color="primary"
                :label="user"
                class="q-mr-sm text-sm"
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
import GroupsConfiguration from './GroupsConfiguration.vue'
import { RowGroup } from 'src/types/Database'

const { grid_view } = storeToRefs(useSettingsStore())
const { groups } = storeToRefs(useAclsStore())
const { updateACLs } = useAclsStore()
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
const groupsArray = computed(() => {
  return Object.entries(groups.value).map(([key, group]) => {
    return { name: key, users: group }
  })
})

function editGroup(group: RowGroup) {
  useDialog()
    .show(GroupsConfiguration, {
      group: group,
      all_groups: groupsArray.value,
    })
    .onOk(async (updatedGroup: RowGroup) => {
      delete groups.value[group.name]
      groups.value[updatedGroup.name] = updatedGroup.users
      await updateACLs({ groups: groups.value })
    })
}

function addGroup() {
  useDialog()
    .show(GroupsConfiguration, {
      group: { name: 'group:', users: [] } satisfies RowGroup,
      all_groups: groupsArray.value,
    })
    .onOk(async (group: RowGroup) => {
      groups.value[group.name] = group.users
      await updateACLs({ groups: groups.value })
    })
}

function deleteGroup(group: RowGroup) {
  useDialog()
    .del()
    .onOk(async () => {
      delete groups.value[group.name]
      await updateACLs({ groups: groups.value })
    })
}
</script>
