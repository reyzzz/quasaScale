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
            {{
              componentProps.group.name === 'group:'
                ? 'Add Group'
                : 'Edit Group'
            }}
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
          :rules="[
            (val) => !!val || 'Field required',
            (val: string) =>
              val.startsWith('group:') || 'Name must start with group:',
            () => checkGroupName() || 'Group name already used',
          ]"
        />
        <q-select
          label="Users"
          outlined
          use-chips
          multiple
          use-input
          input-debounce="300"
          @filter="filterUsers"
          v-model="_group.users"
          :options="options"
        />
      </q-card-section>
      <q-card-actions vertical>
        <q-btn
          color="primary"
          label="save"
          type="submit"
          icon="save"
          rounded
          outline
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { extend } from 'quasar'
import { RowGroup } from 'src/types/Database'
const { users } = storeToRefs(useUsersStore())

const props = defineProps<{
  onDialogOK: (group: RowGroup) => void
  componentProps: {
    group: RowGroup
    all_groups: RowGroup[]
  }
}>()
const user_names = users.value.map((u) => u.name)
const options = ref<string[]>(extend(true, [], user_names))
const _group = ref<RowGroup>(extend(true, {}, props.componentProps.group))

function filterUsers(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (!val) options.value = user_names
    options.value = user_names.filter((user) =>
      user.toLowerCase().includes(val.toLowerCase()),
    )
  })
}
function checkGroupName() {
  const group = props.componentProps.all_groups.find(
    (group) => group.name === _group.value.name,
  )
  if (group && props.componentProps.group.name !== _group.value.name)
    return false
  return true
}
function saveChanges() {
  props.onDialogOK(_group.value)
}
</script>
