<template>
  <q-card
    flat
    :bordered="$q.screen.gt.xs"
    class="rounded-xl! w-100% bg-stone-950"
  >
    <q-form @submit="saveChanges">
      <q-card-section class="q-py-sm">
        <div class="row justify-between items-center">
          <div class="items-center text-h6">
            {{ _group.name !== '' ? 'Edit Group' : 'Add Group' }}
          </div>
          <div>
            <q-btn flat round icon="close" v-close-popup />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <q-input
          outlined
          hide-bottom-space
          v-model="_group.name"
          label="Group Name"
          :rules="[(val) => !!val || 'Field required']"
        />
        <q-select
          label="Users"
          outlined
          use-chips
          option-label="name"
          option-value="id"
          new-value-mode="add-unique"
          multiple
          @new-value="addUser"
          use-input
          input-debounce="1000"
          @filter="filterUsers"
          v-model="_group.users"
          :options="options"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn color="primary" label="save" type="submit" icon="save" />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend } from 'quasar'
import { Group, User } from 'src/types/Database'
const { users } = storeToRefs(useUsersStore())

const props = defineProps<{
  onDialogOK: (group: Group) => void
  componentProps: {
    group: Group
  }
}>()
const options = ref<User[]>(extend(true, [], users.value))
const _group = ref<Group>(extend(true, {}, props.componentProps.group))
const inputValue = ref('sc')
function filterUsers(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (!val) options.value = users.value
    options.value = users.value.filter((user) =>
      user.name.toLowerCase().includes(val.toLowerCase()),
    ) // Filter based on inclusion
  })
}

function addUser(id: string) {
  inputValue.value = ''
  const user = users.value.find((user) => {
    return user.id === id
  })
  if (user) _group.value.users.push(user)
}

function saveChanges() {
  props.onDialogOK(_group.value)
}
</script>
