<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]"
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
          color="primary"
          outline
          @click="addUser"
          :dense="$q.screen.lt.sm"
        />
      </template>
      <template #body="props">
        <q-tr :props="props">
          <q-td>{{ props.row.id }}</q-td>
          <q-td>{{ props.row.name }}</q-td>
          <q-td>{{ props.row.createdAt }}</q-td>

          <q-td key="actions" :props="props">
            <q-btn
              icon="edit"
              flat
              round
              color="secondary"
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
              <q-tooltip> Manage PreAuthKeys </q-tooltip>
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
        <q-card flat bordered class="rounded-xl">
          <q-card-section>
            <div class="row q-mb-sm justify-between">
              <div class="text-h5 row">
                {{ props.row.name }}
              </div>
              <q-btn flat round dense icon="more_vert">
                <q-menu auto-close>
                  <q-list class="w-max">
                    <q-item clickable @click="managePreAuthKeys(props.row)">
                      <q-item-section class="text-primary">
                        Manage PreAuthKeys
                      </q-item-section>
                    </q-item>
                    <q-item clickable @click="renameUser(props.row)">
                      <q-item-section class="text-primary">
                        Rename user
                      </q-item-section>
                    </q-item>

                    <q-separator />
                    <q-item clickable @click="deleteUser(props.row)">
                      <q-item-section class="text-negative">
                        Delete user
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <div>
              <span class="text-weight-bold text-accent"> Creation Date: </span>
              <span class="text-info">{{ props.row.createdAt }} </span>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { date, QTableColumn, useQuasar } from 'quasar'
import PreAuthKeyComponent from 'src/components/PreAuthKeyComponent.vue'
import PromptComponent from 'src/components/PromptComponent.vue'
import { User } from 'src/types/Database'

const { users } = storeToRefs(useUsersStore())
const { getuserPreAuthKeys, removeUser, addNewUser, modifyUserName } =
  useUsersStore()
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
    name: 'createdAt',
    required: true,
    label: 'Creation Date',
    field: 'createdAt',
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

const { grid_view } = storeToRefs(useSettingsStore())
function renameUser(user: User): void {
  $q.dialog({
    cancel: {
      label: 'Cancel',
      'no-caps': true,
      flat: true,
      color: 'negative',
    },
    ok: {
      label: 'Confirm',
      color: 'primary',
      'no-caps': true,
      flat: true,
    },
    style:
      ' box-shadow: none; border: 1.5px solid #5c5c5c;border-radius: 12px ',

    prompt: {
      model: user.name,
      type: 'text',
      isValid(value) {
        if (value.length === 0) return false
        const result = checkUsername(value, user.name)

        return result === true
      },
      rules: [
        (val) => !!val || 'Field is required',

        (val: string) => {
          const result = checkUsername(val, user.name)
          return result === true || result
        },
      ],
    },
    color: 'secondary',
    html: true,
    message: 'Insert username',
    persistent: true,
    title: 'Rename User',
  }).onOk(async (username) => {
    try {
      await modifyUserName(user.name, username)
      user.name = username
      useNotify('Username updated successfully', 'check')
    } catch (error) {
      useNotify(
        'An error has occured while updating username',
        'warning',
        'negative',
      )
    }
  })
}

function deleteUser(index: number): void {
  useDialog()
    .del()
    .onOk(async () => {
      try {
        const user = users.value[index]
        await removeUser(user.name)
        users.value = users.value.filter((val, ind) => index !== ind)
        useNotify('User delete successfully', 'check')
      } catch (error) {
        useNotify(
          'An error has occured while deleting this user',
          'warning',
          'negative',
        )
      }
    })
}

async function managePreAuthKeys(user: User): Promise<void> {
  const pre_auth_key = await getuserPreAuthKeys(user.name)
  useDialog()
    .show(PreAuthKeyComponent, {
      pre_auth_keys: pre_auth_key,
      username: user.name,
    })
    .onOk(() => {
      useNotify('PreAuthsKeys updated successfully', 'check')
    })
}

function addUser(): void {
  useDialog()
    .show(PromptComponent, {
      title: 'Please enter username',
      description: 'Input username',
      label: 'save',
      users: users.value,
      username: '',
    })
    .onOk(async (userName) => {
      try {
        const updatedUser = await addNewUser(userName)
        const creationDate = date.formatDate(
          updatedUser.createdAt,
          'YYYY-MM-DD HH:mm',
        )
        const user: User = {
          id: '8',
          name: userName,
          createdAt: creationDate,
        }
        users.value.push(user)
        useNotify('User added successfully', 'check')
      } catch (error) {
        useNotify('An error has occured while adding this user', 'check')
      }
    })
}
function checkUsername(name: string, org_name?: string): boolean | string {
  if (org_name) {
    if (name === org_name) return true
  }
  const user = users.value.find((user) => user.name === name)
  return user ? 'UserName already exist' : true
}
</script>
