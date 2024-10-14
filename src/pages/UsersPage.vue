<template>
  <q-page padding>
    <q-table
      :grid="grid_view || $q.screen.lt.sm"
      class="rounded-xl"
      table-header-class="text-[#929289] font-bold"
      title-class="title-text"
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
              <div>
                <q-btn
                  flat
                  round
                  dense
                  @click="renameUser(props.row)"
                  color="secondary"
                  icon="edit"
                >
                  <q-tooltip>Rename User</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  @click="deleteUser(props.rowIndex)"
                  color="negative"
                  icon="delete"
                >
                  <q-tooltip> Delete User </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="row justify-between items-center">
              <div>
                <span class="text-weight-bold text-accent">
                  Creation Date:
                </span>
                <span class="text-info">{{ props.row.createdAt }} </span>
              </div>
              <q-btn
                flat
                round
                dense
                @click="managePreAuthKeys(props.row)"
                color="positive"
                icon="key"
              >
                <q-tooltip>Manage PreAuthKeys</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { QTableColumn, useQuasar } from 'quasar'
import PreAuthKeyComponent from 'src/components/users/PreAuthKeyComponent.vue'
import PromptComponent from 'src/components/PromptComponent.vue'
import { User, WithPrefix } from 'src/types/Database'
const { isPatternPresentInEntity, replacePatternInEntity } = useUtils()
const { users } = storeToRefs(useUsersStore())
const { acl_config } = storeToRefs(useAclsStore())
const { updateACLs } = useAclsStore()
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
  useDialog()
    .show(PromptComponent, {
      title: 'Rename User',
      description: `Old username ${user.name}, Input new username`,
      label: 'save',
      input_label: 'Username',
      btn_label: 'rename',
    })
    .onOk(async (username) => {
      try {
        if (isUserExist(username)) {
          useNotify('Username already exist', 'warning', 'negative')
          return
        }
        await modifyUserName(user.name, username)
        acl_config.value = await replacePatternInEntity(
          user.name,
          username,
          JSON.stringify(acl_config.value),
        )
        updateACLs(acl_config.value)
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
  const user = users.value[index] as User

  useDialog()
    .del()
    .onOk(async () => {
      try {
        if (
          isPatternPresentInEntity(user.name, JSON.stringify(acl_config.value))
        ) {
          useNotify(
            'Unable to remove this User as it is currently associated with ACLs ',
            'warning',
            'negative',
          )
          return
        }
        await removeUser(user.name)
        users.value.splice(index, 1)
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
  const user_accepted_tags = fetchUserTags(user.name)

  useDialog()
    .show(PreAuthKeyComponent, {
      pre_auth_keys: pre_auth_key,
      username: user.name,
      tags: user_accepted_tags,
    })
    .onOk(() => {
      useNotify('PreAuthsKeys updated successfully', 'check')
    })
}

function addUser(): void {
  useDialog()
    .show(PromptComponent, {
      title: 'Add User',
      description: 'Input username',
      label: 'save',
      input_label: 'Username',
    })
    .onOk(async (userName: string) => {
      try {
        if (isUserExist(userName)) {
          useNotify('Username already exist', 'warning', 'negative')
          return
        }
        const user: User = await addNewUser(userName)
        user.createdAt = new Date(user.createdAt).toLocaleString()
        users.value.push(user)
        useNotify('User added successfully', 'check')
      } catch (error) {
        useNotify('An error has occured while adding this user', 'check')
      }
    })
}
function isUserExist(name: string, org_name?: string): boolean {
  if (org_name) {
    if (name === org_name) return true
  }
  const user = users.value.find((user) => user.name === name)
  return user ? true : false
}
function fetchUserTags(user: string): string[] {
  return Object.entries(acl_config.value.tagOwners).reduce(
    (acc, [tag, owners]) => {
      const hasAccess = owners.some((owner: string) => {
        if (owner.startsWith('group:')) {
          const groupKey = owner as WithPrefix<'group:'>
          const groupMembers = acl_config.value.groups[groupKey]
          return groupMembers.includes(user)
        } else {
          return owner === user
        }
      })

      if (hasAccess) {
        acc.push(tag)
      }

      return acc
    },
    [] as string[],
  )
}
</script>
