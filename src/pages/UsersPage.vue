<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      class="rounded-xl"
      :rows="users"
      :columns="cols"
      row-key="name"
      :filter="filter"
      :pagination="{ rowsPerPage: 0 }"
      title="Users"
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
          :label="$q.screen.gt.sm ? 'New User' : ''"
          color="accent"
          outline
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.id }}</q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.creationDate }}</q-td>
          <q-td key="actions" :props="props">
            <q-btn
              icon="edit"
              flat
              round
              color="blue-13"
              dense
              class="q-ml-md"
              @click="renameUser(props.row)"
            >
              <q-tooltip> Rename user </q-tooltip>
            </q-btn>
            <q-btn
              icon="key"
              flat
              round
              color="green"
              dense
              class="q-ml-md"
              @click="managePreAuthKeys(props.row)"
            >
              <q-tooltip> Manage PreAuthKey </q-tooltip>
            </q-btn>
            <q-btn
              icon="delete"
              flat
              round
              color="negative"
              dense
              class="q-ml-md"
              @click="deleteUser(props.rowIndex)"
            >
              <q-tooltip> Delete User </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template #item="props">
        <q-card flat bordered class="rounded-borders q-mr-sm q-mb-sm user-card">
          <q-card-section class="q-pb-xs">
            <div class="row q-mb-sm justify-between">
              <div class="text-h5 row items-center">
                {{ props.row.name }}
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list style="width: max-content">
                    <q-item clickable @click="managePreAuthKeys(props.row)">
                      <q-item-section class="text-blue-13"
                        >Manage PreAuthKey</q-item-section
                      >
                    </q-item>
                    <q-item clickable @click="renameUser(props.row)">
                      <q-item-section class="text-blue-13"
                        >Rename User</q-item-section
                      >
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="deleteUser(props.row)">
                      <q-item-section class="text-negative"
                        >Delete User</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div class="text-weight-medium text-primary">
              Creation Date:
              <span class="text-secondary">{{ props.row.creationDate }} </span>
            </div>

            <div class="text-weight-medium text-primary q-my-sm">
              PreAuthKeys:
              <span class="text-secondary">{{ props.row.name }} </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn, useQuasar } from 'quasar'
import PreAuthKeyComponent from 'src/components/PreAuthKeyComponent.vue'
import { User } from 'src/types/Database'

const { users } = storeToRefs(useUsersStore())
const $q = useQuasar()
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
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'creationDate',
    required: true,
    label: 'Creation Date',
    field: 'creationDate',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: '',
    align: 'right',
  },
])
const filter = ref('')
const user_edit = ref<User | null>(null)
const { grid_view } = storeToRefs(useSettingsStore())
function renameUser(user: User) {
  useDialog()
    .prompt(user.name)
    .onOk((data: string) => {
      user.name = data
    })
}

function deleteUser(index: number) {
  useDialog()
    .del()
    .onOk(() => {
      users.value = users.value.filter((val, ind) => index !== ind)
      useNotify('User delete successfully', 'check')
    })
}

function managePreAuthKeys(user: User) {
  user_edit.value = user
  if (user_edit.value !== null) {
    useDialog().show(
      PreAuthKeyComponent,
      {
        pre_auth_keys: user_edit.value.pre_auth_keys,
      },
      $q.platform.is.mobile ? 'bottom' : 'standard',
    )
  }
}
</script>
